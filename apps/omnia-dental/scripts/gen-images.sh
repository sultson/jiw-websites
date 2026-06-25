#!/usr/bin/env bash
# Image generation via Runware (gpt-image@2). Regenerates only MISSING files.
# All fire in PARALLEL, each curl bounded with --max-time so no call can hang
# the run; a short timeout + several retries rides out gpt-image latency spikes.
set -u
export RUNWARE_API_KEY="n31amyHUqDm25NnCNUu52tcUjjZStVyC"
export API_URL="https://api.runware.ai/v1"
cd "$(dirname "$0")/.." || exit 1
mkdir -p public/images/treatments public/images/before-after

PHOTO=", soft natural daylight, warm cream and sage green palette, bright clean modern Dutch dental practice interior, premium calm trustworthy healthcare editorial photography, shallow depth of field, candid, no text, no watermark, no logo, no signage"
ILLUS=", clean medical 3D dental illustration, anatomically realistic teeth and pink gums, soft studio lighting, light warm neutral background, educational cross-section clarity, high detail render, no text, no watermark, no labels"
BA=", extreme close-up dental macro photography of a mouth and natural smile, realistic lips and teeth, soft even frontal lighting, plain neutral background, no text, no watermark"

gen() {
  local path="$1" w="$2" h="$3" fmt="$4" prompt="$5"
  if [ -s "public/images/$path" ]; then echo "SKIP $path"; return 0; fi
  local uuid resp url tries=0
  while [ $tries -lt 5 ]; do
    uuid=$(node -e "process.stdout.write(crypto.randomUUID())")
    resp=$(curl -s --max-time 70 -X POST "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $RUNWARE_API_KEY" -d '[{
      "taskType":"imageInference",
      "taskUUID":"'"$uuid"'",
      "model":"openai:gpt-image@2",
      "positivePrompt":'"$(node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$prompt")"',
      "width":'"$w"',"height":'"$h"',"numberResults":1,"outputFormat":"'"$fmt"'"
    }]')
    url=$(echo "$resp" | jq -r '.data[0].imageURL // empty')
    if [ -n "$url" ]; then
      curl -s --max-time 60 -o "public/images/$path" "$url"
      [ -s "public/images/$path" ] && { echo "OK   $path"; return 0; }
    fi
    tries=$((tries+1)); sleep 1
  done
  echo "FAIL $path :: $(echo "$resp" | jq -c '.errors // .' 2>/dev/null | head -c 160)"
}

gen "treatments/periodieke-controle.webp" 1536 1024 WEBP "A friendly female dentist smiling warmly while standing beside a relaxed patient seated in a dental chair, holding a small dental mirror, modern practice${PHOTO}" &
gen "treatments/angst-voor-de-tandarts.webp" 1536 1024 WEBP "A calm reassured adult patient relaxing comfortably in a dental chair, serene peaceful expression, soft warm light, a reassuring atmosphere${PHOTO}" &
gen "treatments/facings.webp" 1536 1024 WEBP "Thin porcelain veneer being placed onto a prepared upper front tooth among natural white teeth${ILLUS}" &
gen "treatments/kronen-en-bruggen.webp" 1536 1024 WEBP "A ceramic dental crown being fitted over a prepared molar tooth, with a three unit bridge visible nearby in the jaw${ILLUS}" &
gen "treatments/implantaten.webp" 1536 1024 WEBP "A titanium dental implant screw with abutment and ceramic crown set into the jaw bone shown in clean cross-section beside natural teeth${ILLUS}" &
gen "treatments/cerec.webp" 1536 1024 WEBP "Modern CAD CAM dentistry, a digitally designed ceramic crown beside a 3D intraoral scan of a tooth, milling and digital design theme${ILLUS}" &
gen "treatments/verstandskies-trekken.webp" 1536 1024 WEBP "An impacted lower wisdom tooth angled against the adjacent molar inside the jaw bone, clear cross-section${ILLUS}" &
gen "treatments/kunstgebit.webp" 1536 1024 WEBP "A complete full upper denture prosthesis with realistic acrylic pink gum and white teeth resting on a soft neutral surface${ILLUS}" &
gen "before-after/whitening-before.webp" 1536 1024 WEBP "A natural smile showing slightly yellowed and dull stained teeth${BA}" &
gen "before-after/whitening-after.webp" 1536 1024 WEBP "A natural smile showing bright clean healthy white teeth${BA}" &
gen "before-after/veneers-before.webp" 1536 1024 WEBP "A smile showing uneven slightly worn front teeth with small gaps and minor chips${BA}" &
gen "before-after/veneers-after.webp" 1536 1024 WEBP "A smile showing beautifully even natural aligned bright front teeth${BA}" &
gen "og-default.jpg" 1536 1024 JPG "A bright modern Dutch dental practice reception area with warm cream and sage green tones, welcoming and premium, healthy smile theme${PHOTO}" &
wait
echo "ALL DONE"
