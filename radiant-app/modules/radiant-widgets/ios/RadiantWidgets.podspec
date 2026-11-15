# Só entra no binário com a chave de build ligada (ADR 2026-11-15). O autolink do
# Expo pula pod cuja plataforma fica acima do alvo do app (`autolinking_manager.rb`,
# `supports_platform?`): com `EXPO_PUBLIC_ENABLE_WIDGETS` desligada, o mínimo
# impossível tira o pod da build, e o binário fica igual ao da `main`.
widgets_enabled = ENV['EXPO_PUBLIC_ENABLE_WIDGETS'].to_s.strip.downcase == 'true'

Pod::Spec.new do |s|
  s.name           = 'RadiantWidgets'
  s.version        = '1.0.0'
  s.summary        = 'Retrato dos widgets no App Group e recarga das timelines.'
  s.description    = 'Modulo Expo local minimo sobre UserDefaults(suiteName:) e WidgetCenter.'
  s.author         = 'Radiant'
  s.homepage       = 'https://github.com/andersonsmelo/Radiant'
  s.platforms      = { :ios => widgets_enabled ? '15.1' : '99.0' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
end
