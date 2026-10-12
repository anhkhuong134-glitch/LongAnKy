Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = Join-Path (Get-Location) "Long Ấn Ký (1).docx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$stream.Close()
$zip.Dispose()

# Use XML parsing or regex to extract paragraphs
$xml = [xml]$content
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")

$paragraphs = $xml.SelectNodes("//w:p", $ns)
$lines = @()
foreach ($p in $paragraphs) {
    $texts = $p.SelectNodes(".//w:t", $ns)
    $line = ""
    foreach ($t in $texts) {
        $line += $t.InnerText
    }
    $lines += $line
}

$fullText = $lines -join "`n"
$fullText | Out-File -FilePath "docx_extracted_text.txt" -Encoding utf8
Write-Output "Extracted paragraphs: $($paragraphs.Count)"
Write-Output "First 2000 chars:"
Write-Output $fullText.Substring(0, [Math]::Min(2000, $fullText.Length))
