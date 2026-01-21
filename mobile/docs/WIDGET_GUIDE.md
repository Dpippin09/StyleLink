# iOS Widget Implementation Guide

## Overview
iOS widgets for StyleLink can show:
- Price drops on saved shoes
- Deal of the day
- Quick search shortcuts
- Price comparison snapshots

## Implementation Options

### Option 1: React Native Widget (Recommended)
Use `react-native-widget-extension` or `expo-widget-kit`

```javascript
// Example widget component
export default function StyleLinkWidget() {
  return (
    <WidgetView>
      <Text>Price Alert</Text>
      <Text>Nike Air Max - $89 (was $120)</Text>
      <Button onPress={() => openApp()}>View Deal</Button>
    </WidgetView>
  );
}
```

### Option 2: Native iOS Widget (SwiftUI)
For advanced features, create native iOS widget

```swift
struct StyleLinkWidget: Widget {
    let kind: String = "StyleLinkWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            StyleLinkWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("StyleLink Deals")
        .description("Track your favorite shoe prices")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
```

## Widget Ideas for StyleLink:
1. **Price Drop Alert Widget** - Shows shoes with recent price drops
2. **Deal of the Day Widget** - Featured shoe deal
3. **Search Shortcut Widget** - Quick search for popular brands
4. **Price Tracker Widget** - Shows price trends for saved shoes
5. **Comparison Widget** - Side-by-side price comparison

## Setup Steps:
1. Add widget extension to your iOS app
2. Configure widget data source (API)
3. Design widget layouts (small, medium, large)
4. Implement deep linking to open app
5. Add to App Store with widget screenshots
