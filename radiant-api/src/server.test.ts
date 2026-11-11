import assert from 'node:assert/strict';
import test from 'node:test';
import { SignJWT } from 'jose';

// O servidor lê o ambiente ao importar. Nenhum teste aqui chega ao banco: o
// endereço não aceita conexão, e as rotas exercitadas param antes da consulta.
process.env.DATABASE_URL = 'postgres://radiant:radiant@127.0.0.1:1/radiant_test';
process.env.JWT_SECRET = 'segredo-de-teste-com-mais-de-trinta-e-dois-caracteres';
process.env.RATE_LIMIT_MAX = '2';
const { buildApp } = await import('./server.js');
const { shouldExposePasswordResetToken } = await import('./config.js');

// Auditoria de 2026-11-10, achados 2 a 4.

test('produção nunca devolve o token de redefinição, mesmo com a opção ligada', () => {
    assert.equal(shouldExposePasswordResetToken({ NODE_ENV: 'production', EXPOSE_PASSWORD_RESET_TOKEN: 'true' }), false);
    assert.equal(shouldExposePasswordResetToken({ NODE_ENV: 'production' }), false);
    assert.equal(shouldExposePasswordResetToken({ NODE_ENV: 'development' }), true);
    assert.equal(shouldExposePasswordResetToken({ NODE_ENV: 'development', EXPOSE_PASSWORD_RESET_TOKEN: 'false' }), false);
});

test('token inválido ou vencido recebe 401, não 500', async (t) => {
    const app = await buildApp();
    t.after(() => app.close());
    const expired = await new SignJWT({ email: 'aluno@example.com' })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject('user-1')
        .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
        .setExpirationTime(Math.floor(Date.now() / 1000) - 3600)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    for (const [remoteAddress, token] of [['198.51.100.1', 'lixo'], ['198.51.100.2', expired]]) {
        const response = await app.inject({
            method: 'GET', url: '/v1/auth/me', remoteAddress, headers: { authorization: `Bearer ${token}` },
        });
        assert.equal(response.statusCode, 401, `token ${token === 'lixo' ? 'inválido' : 'vencido'}`);
    }
});

test('o limite conta cada cliente atrás do nginx, e rotas inexistentes num grupo só', async (t) => {
    const app = await buildApp();
    t.after(() => app.close());
    // Atrás do nginx, todo pedido chega de 127.0.0.1; o cliente vem no X-Forwarded-For.
    const pedir = (url: string, client: string) => app.inject({
        method: 'GET', url, remoteAddress: '127.0.0.1', headers: { 'x-forwarded-for': client },
    });

    await pedir('/v1/auth/me', '203.0.113.1');
    await pedir('/v1/auth/me', '203.0.113.1');
    assert.equal((await pedir('/v1/auth/me', '203.0.113.1')).statusCode, 429, 'o terceiro do mesmo cliente passa do limite');
    assert.notEqual((await pedir('/v1/auth/me', '203.0.113.2')).statusCode, 429, 'outro cliente não é bloqueado');

    // Caminhos aleatórios não abrem um contador novo cada um.
    await pedir('/a1', '203.0.113.3');
    await pedir('/a2', '203.0.113.3');
    assert.equal((await pedir('/a3', '203.0.113.3')).statusCode, 429);
});

// Achado 12: violação de unicidade ou de chave estrangeira é erro do pedido, não do servidor.
test('erros de restrição do banco viram 409 e 422, não 500', async (t) => {
    const app = await buildApp();
    t.after(() => app.close());
    const pgError = (code: string) => Object.assign(new Error(`violação ${code}`), { code });
    app.get('/teste/unico', async () => { throw pgError('23505'); });
    app.get('/teste/chave', async () => { throw pgError('23503'); });
    app.get('/teste/outro', async () => { throw new Error('falha qualquer'); });

    const pedir = (url: string) => app.inject({ method: 'GET', url, remoteAddress: '192.0.2.10' });
    assert.equal((await pedir('/teste/unico')).statusCode, 409);
    assert.equal((await pedir('/teste/chave')).statusCode, 422);
    const outro = await app.inject({ method: 'GET', url: '/teste/outro', remoteAddress: '192.0.2.11' });
    assert.equal(outro.statusCode, 500);
});
