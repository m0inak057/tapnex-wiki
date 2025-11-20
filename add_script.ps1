Get-ChildItem -Path . -Recurse -Filter *.html | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -notmatch 'adsbygoogle\.js') {
        $content = $content -ireplace '</head>', "<script async src=`"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4315586112110103`" crossorigin=`"anonymous`"></script>`n</head>"
        Set-Content $_.FullName $content
    }
}