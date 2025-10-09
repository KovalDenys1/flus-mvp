export function googleMapsEmbedUrl(lat: number, lng: number, label = "Møtepunkt") {
  const q = encodeURIComponent(`${lat},${lng} (${label})`);
  return `https://www.google.com/maps?q=${q}&z=15&output=embed`;
}