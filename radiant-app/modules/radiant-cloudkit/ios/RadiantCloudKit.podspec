Pod::Spec.new do |s|
  s.name           = 'RadiantCloudKit'
  s.version        = '1.0.0'
  s.summary        = 'Backup do progresso no banco privado do CloudKit.'
  s.description    = 'Modulo Expo local minimo sobre CKContainer.privateCloudDatabase.'
  s.author         = 'Radiant'
  s.homepage       = 'https://github.com/andersonsmelo/Radiant'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
end
