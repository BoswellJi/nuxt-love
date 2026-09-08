#!/bin/bash

HTML_FILE="index.html"
TEMP_FILE="index_optimized.html"
cp "$HTML_FILE" "$TEMP_FILE"

# 转换第一屏图片为 base64
convert_to_base64() {
    local img_file="$1"
    local mime_type="$2"
    
    if [ -f "$img_file" ]; then
        local base64_data=$(base64 -w 0 "$img_file")
        echo "data:$mime_type;base64,$base64_data"
    fi
}

# 转换 jhz.jpg (logo)
echo "Converting jhz.jpg..."
JHZ_BASE64=$(convert_to_base64 "images/jhz.jpg" "image/jpeg")
sed -i "s|src=\"images/jhz.jpg\"|src=\"$JHZ_BASE64\"|g" "$TEMP_FILE"

# 转换 fm.jpg (封面)
echo "Converting fm.jpg..."
FM_BASE64=$(convert_to_base64 "images/fm.jpg" "image/jpeg")
sed -i "s|src=\"images/fm.jpg\"|src=\"$FM_BASE64\"|g" "$TEMP_FILE"

# 为其他图片添加懒加载
echo "Adding lazy loading to other images..."
sed -i 's|<img src="images/\([^"]*\)" alt="\([^"]*\)">|<img src="images/\1" alt="\2" loading="lazy" decoding="async">|g' "$TEMP_FILE"

mv "$TEMP_FILE" "$HTML_FILE"
echo "Done!"
