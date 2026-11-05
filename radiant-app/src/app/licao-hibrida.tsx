import { ContentUpdatedScreen } from '../features/content/components/ContentUpdatedScreen';

// Piloto da lição híbrida (spec 2026-09-23). O gate vive na rota, como no
// console: o V3 não está ativado, e o aluno não alcança esta tela.
export default function HybridLessonRoute() {
    return <ContentUpdatedScreen />;
}
