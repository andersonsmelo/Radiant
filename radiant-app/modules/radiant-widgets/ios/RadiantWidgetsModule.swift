import ExpoModulesCore
import WidgetKit

/**
 Ponte mínima do app para os widgets (ADR 2026-11-15): grava o retrato, em
 texto JSON opaco, no App Group, e pede a recarga das timelines. Toda regra
 (sequência, meta, linha do tempo) mora no TypeScript.
 */
// A mesma chave de `targets/widget/RadiantWidgets.swift`, que a lê.
private let snapshotKey = "radiant.widget.snapshot"

public class RadiantWidgetsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("RadiantWidgets")

    Function("write") { (appGroup: String, json: String) -> Bool in
      guard let defaults = UserDefaults(suiteName: appGroup) else { return false }
      defaults.set(json, forKey: snapshotKey)
      return true
    }

    Function("reloadTimelines") {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }
}
