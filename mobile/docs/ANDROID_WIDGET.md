# Android Widget Implementation

## Overview
Android widgets for StyleLink using React Native:

### Option 1: React Native Android Widget
Use `react-native-android-widget` library

```javascript
// android-widget.js
import { registerWidget } from 'react-native-android-widget';

const PriceAlertWidget = () => (
  <widget-view>
    <text>Price Drop Alert</text>
    <text>Adidas Ultraboost - $95 (was $130)</text>
    <button onPress={() => openApp('product/123')}>
      View Deal
    </button>
  </widget-view>
);

registerWidget('price_alert', PriceAlertWidget);
```

### Option 2: Native Android Widget
```xml
<!-- widget_layout.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@drawable/widget_background">
    
    <TextView
        android:id="@+id/shoe_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Nike Air Max"
        android:textSize="16sp" />
    
    <TextView
        android:id="@+id/price_info"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="$89 (was $120)"
        android:textColor="#FF4444" />
        
</LinearLayout>
```

## Widget Types for StyleLink:
1. **1x1 Widget** - Single shoe price
2. **2x1 Widget** - Price comparison
3. **4x2 Widget** - Multiple deal listings
4. **Resizable Widget** - Adaptive content
