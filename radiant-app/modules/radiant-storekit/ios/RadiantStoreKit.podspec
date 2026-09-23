Pod::Spec.new do |s|
  s.name           = 'RadiantStoreKit'
  s.version        = '1.0.0'
  s.summary        = 'Assinatura Radiant Ilimitado pelo StoreKit 2.'
  s.description    = 'Modulo Expo local minimo sobre StoreKit 2, sem dependencia de terceiro.'
  s.author         = 'Radiant'
  s.homepage       = 'https://github.com/andersonsmelo/Radiant'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'StoreKit'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
end
