import SwiftUI
import WidgetKit

// Widgets da tela inicial (ADR 2026-11-15). O app grava o retrato em
// `radiant.widget.snapshot` no App Group, já com a linha do tempo calculada
// (`src/features/widgets/widgetSnapshot.ts`). Aqui só se lê e se desenha: a regra
// da sequência mora no JS, e nada dela é refeito em Swift.

private let appGroup = "group.com.ascendcreative.radiant.widgets"
// A mesma chave de `modules/radiant-widgets/ios/RadiantWidgetsModule.swift`, que a grava.
private let snapshotKey = "radiant.widget.snapshot"
private let knownSchemaVersion = 1
private let homeURL = URL(string: "radiantapp://")!

struct WidgetSnapshot: Decodable {
    struct Day: Decodable {
        let startsAt: Double
        let streakDays: Int
        let countsToday: Bool
        let goalCompleted: Int
        let goalTarget: Int
    }

    struct Lesson: Decodable {
        let title: String
        let url: String
    }

    let schemaVersion: Int
    let entries: [Day]
    let nextLesson: Lesson?
}

struct RadiantEntry: TimelineEntry {
    let date: Date
    /// `nil` é o estado neutro: sem retrato, ilegível ou de uma versão que este widget não conhece.
    let day: WidgetSnapshot.Day?
    let nextLesson: WidgetSnapshot.Lesson?
}

func loadSnapshot() -> WidgetSnapshot? {
    guard let raw = UserDefaults(suiteName: appGroup)?.string(forKey: snapshotKey),
          let data = raw.data(using: .utf8),
          let snapshot = try? JSONDecoder().decode(WidgetSnapshot.self, from: data),
          snapshot.schemaVersion == knownSchemaVersion,
          !snapshot.entries.isEmpty
    else { return nil }
    return snapshot
}

/// A entrada que vale agora e as futuras, cada uma na meia-noite local que o app calculou.
func timelineEntries(_ snapshot: WidgetSnapshot?, now: Date) -> [RadiantEntry] {
    guard let snapshot else { return [RadiantEntry(date: now, day: nil, nextLesson: nil)] }
    let dated = snapshot.entries.map { (Date(timeIntervalSince1970: $0.startsAt / 1000), $0) }
    // Relógio atrasado em relação ao retrato: vale a primeira entrada.
    let current = dated.lastIndex { $0.0 <= now } ?? 0
    var result = [RadiantEntry(date: now, day: dated[current].1, nextLesson: snapshot.nextLesson)]
    for (date, day) in dated[(current + 1)...] {
        result.append(RadiantEntry(date: date, day: day, nextLesson: snapshot.nextLesson))
    }
    return result
}

struct RadiantProvider: TimelineProvider {
    func placeholder(in context: Context) -> RadiantEntry {
        RadiantEntry(
            date: .now,
            day: .init(startsAt: 0, streakDays: 5, countsToday: true, goalCompleted: 2, goalTarget: 3),
            nextLesson: .init(title: "Incidências de tórax", url: "radiantapp://")
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (RadiantEntry) -> Void) {
        completion(context.isPreview ? placeholder(in: context) : timelineEntries(loadSnapshot(), now: .now)[0])
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<RadiantEntry>) -> Void) {
        // `.never`: o app pede recarga quando o dado muda, e as viradas já estão nas entradas.
        completion(Timeline(entries: timelineEntries(loadSnapshot(), now: .now), policy: .never))
    }
}

// MARK: - Textos

func streakLabel(_ days: Int) -> String {
    days == 1 ? "1 dia seguido" : "\(days) dias seguidos"
}

func todayLabel(_ day: WidgetSnapshot.Day) -> String {
    if day.countsToday { return "Hoje já conta" }
    return day.streakDays > 0 ? "Estude hoje para manter" : "Comece hoje"
}

func accessibilitySummary(_ entry: RadiantEntry, medium: Bool) -> String {
    guard let day = entry.day else { return "Radiant. Abra o app para ver sua sequência." }
    var parts = ["Sequência de \(streakLabel(day.streakDays))", todayLabel(day)]
    if medium {
        parts.append("Meta do dia: \(day.goalCompleted) de \(day.goalTarget)")
        if let lesson = entry.nextLesson { parts.append("Próxima aula: \(lesson.title)") }
    }
    return parts.joined(separator: ". ")
}

// MARK: - Vistas

struct NeutralView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Image(systemName: "flame.fill").foregroundStyle(Color("chama")).font(.title2)
            Spacer(minLength: 0)
            Text("Abra o Radiant")
                .font(.headline)
                .foregroundStyle(Color("texto"))
                .minimumScaleFactor(0.7)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    }
}

struct StreakBlock: View {
    let day: WidgetSnapshot.Day

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Image(systemName: "flame.fill")
                .font(.title3)
                .foregroundStyle(day.streakDays > 0 ? Color("chama") : Color("textoSecundario"))
            Spacer(minLength: 0)
            Text("\(day.streakDays)")
                .font(.system(.largeTitle, design: .rounded).weight(.bold))
                .foregroundStyle(Color("texto"))
                .minimumScaleFactor(0.5)
                .lineLimit(1)
            Text(day.streakDays == 1 ? "dia seguido" : "dias seguidos")
                .font(.caption)
                .foregroundStyle(Color("textoSecundario"))
                .lineLimit(1)
                .minimumScaleFactor(0.7)
            HStack(spacing: 4) {
                Image(systemName: day.countsToday ? "checkmark.circle.fill" : "circle")
                    .foregroundStyle(day.countsToday ? Color("sucesso") : Color("textoSecundario"))
                Text(todayLabel(day))
                    .foregroundStyle(Color("texto"))
                    .lineLimit(2)
                    .minimumScaleFactor(0.7)
            }
            .font(.caption2.weight(.semibold))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    }
}

struct SmallView: View {
    let entry: RadiantEntry

    var body: some View {
        Group {
            if let day = entry.day { StreakBlock(day: day) } else { NeutralView() }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(accessibilitySummary(entry, medium: false))
        .widgetURL(homeURL)
    }
}

struct MediumView: View {
    let entry: RadiantEntry

    var body: some View {
        Group {
            if let day = entry.day {
                HStack(alignment: .top, spacing: 16) {
                    StreakBlock(day: day)
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Meta do dia")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(Color("textoSecundario"))
                        ProgressView(value: Double(min(day.goalCompleted, day.goalTarget)), total: Double(max(day.goalTarget, 1)))
                            .tint(Color("primaria"))
                        Text("\(day.goalCompleted) de \(day.goalTarget)")
                            .font(.caption)
                            .foregroundStyle(Color("texto"))
                        Spacer(minLength: 0)
                        Text("Próxima aula")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(Color("textoSecundario"))
                        Text(entry.nextLesson?.title ?? "Abra a trilha")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(Color("texto"))
                            .lineLimit(2)
                            .minimumScaleFactor(0.7)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                }
            } else {
                NeutralView()
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(accessibilitySummary(entry, medium: true))
        .widgetURL(entry.nextLesson.flatMap { URL(string: $0.url) } ?? homeURL)
    }
}

struct SmallWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "RadiantStreakSmall", provider: RadiantProvider()) { entry in
            SmallView(entry: entry).containerBackground(Color("fundo"), for: .widget)
        }
        .configurationDisplayName("Sequência")
        .description("Seus dias seguidos e se hoje já conta.")
        .supportedFamilies([.systemSmall])
    }
}

struct MediumWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "RadiantStudyMedium", provider: RadiantProvider()) { entry in
            MediumView(entry: entry).containerBackground(Color("fundo"), for: .widget)
        }
        .configurationDisplayName("Estudo do dia")
        .description("Sequência, meta do dia e a próxima aula.")
        .supportedFamilies([.systemMedium])
    }
}

@main
struct RadiantWidgetBundle: WidgetBundle {
    var body: some Widget {
        SmallWidget()
        MediumWidget()
    }
}

#Preview(as: .systemSmall) {
    SmallWidget()
} timeline: {
    RadiantEntry(date: .now, day: .init(startsAt: 0, streakDays: 5, countsToday: true, goalCompleted: 2, goalTarget: 3), nextLesson: nil)
    RadiantEntry(date: .now, day: nil, nextLesson: nil)
}

#Preview(as: .systemMedium) {
    MediumWidget()
} timeline: {
    RadiantEntry(date: .now, day: .init(startsAt: 0, streakDays: 0, countsToday: false, goalCompleted: 0, goalTarget: 3), nextLesson: .init(title: "Incidências de tórax em PA e perfil", url: "radiantapp://"))
}
