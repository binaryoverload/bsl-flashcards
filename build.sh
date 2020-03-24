#!/bin/bash

TitleCase() {
    sed 's/.*/\L&/; s/[a-z]*/\u&/g' <<<"$1"    
}

PROMPTSDIR=prompts

INPUT=$PROMPTSDIR/all_prompts.csv
IFS=','
[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }

# Reset all files
find $PROMPTSDIR/ -type f -not -name 'all_prompts.csv' -delete

while read name category week video desc
do
    if [ ! -f "prompts/categories" ] || [ ! -f "prompts/weeks" ]
    then
        touch prompts/categories
        touch prompts/weeks
    fi

    if ! grep -Fxq "$(TitleCase $category)" "prompts/categories"
    then
        echo $(TitleCase $category) >> prompts/categories
    fi

    if ! grep -Fxq "$week" "prompts/weeks"
    then
        echo $week >> prompts/weeks
    fi

    echo "$name,$video,$desc" >> "prompts/cat-$category.csv"
    echo "$name,$video,$desc" >> "prompts/wk-$week.csv"


done < $INPUT