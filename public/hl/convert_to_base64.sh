#!/bin/bash

# 读取 HTML 文件
HTML_FILE="index.html"
TEMP_FILE="index_temp.html"
cp "$HTML_FILE" "$TEMP_FILE"

# 获取所有使用的图片
IMAGES=$(grep -oP 'src="images/[^"]*"' "$HTML_FILE" | sed 's/src="//;s/"//' | sort -u)

for img in $IMAGES; do
    if [ -f "$img" ]; then
        # 检测 MIME 类型
        if [[ "$img" == *.jpg ]] || [[ "$img" == *.jpeg ]]; then
            MIME="image/jpeg"
        elif [[ "$img" == *.png ]]; then
            MIME="image/png"
        elif [[ "$img" == *.gif ]]; then
            MIME="image/gif"
        else
            continue
        fi
        
        # 转换为 base64
        BASE64=$(base64 -w 0 "$img" 2>/dev/null || base64 "$img" 2>/dev/null | tr -d '\n')
        
        # 替换 HTML 中的图片路径
        sed -i "s|src=\"$img\"|src=\"data:$MIME;base64,$BASE64\"|g" "$TEMP_FILE"
        echo "Converted: $img"
    fi
done

# 替换原文件
mv "$TEMP_FILE" "$HTML_FILE"
echo "Done!"
