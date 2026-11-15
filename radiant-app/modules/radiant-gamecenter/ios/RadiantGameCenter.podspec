Pod::Spec.new do |s|
  s.name           = 'RadiantGameCenter'
  s.version        = '1.0.0'
  s.summary        = 'Liga semanal do Radiant pelo Game Center.'
  s.description    = 'Modulo Expo local minimo sobre GameKit, sem dependencia de terceiro.'
  s.author         = 'Radiant'
  s.homepage       = 'https://github.com/andersonsmelo/Radiant'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'GameKit'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
end
