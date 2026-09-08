#!/bin/bash

HTML_FILE="index.html"
TEMP_FILE="index_base64.html"
cp "$HTML_FILE" "$TEMP_FILE"

# 获取所有使用的图片
IMAGES=$(grep -o 'images/[^"]*\.jpg' "$HTML_FILE" | sort -u)

for img in $IMAGES; do
    if [ -f "$img" ]; then
        echo "Converting: $img"
        # 转换为 base64
        BASE64=$(base64 -w 0 "$img")
        # 替换 HTML 中的图片路径
        sed -i "s|src=\"$img\"|src=\"data:image/jpeg;base64,$BASE64\"|g" "$TEMP_FILE"
    fi
done

mv "$TEMP_FILE" "$HTML_FILE"
echo "All images converted to base64!"
