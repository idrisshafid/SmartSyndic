import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

// Custom pin (dark circle + house glyph + pointer tail) rendered as an
// inline SVG data-URI. Using divIcon with inline markup means we don't
// need Leaflet's default marker PNGs at all here, which sidesteps the
// classic Leaflet-breaks-under-bundlers icon issue entirely.
const homeIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:40px;height:52px;">
      <div style="
        width:40px;height:40px;border-radius:9999px;background:#111827;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 12px rgba(0,0,0,0.35);
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9.5 12 3l9 6.5" />
          <path d="M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10" />
        </svg>
      </div>
      <div style="
        position:absolute;left:50%;top:38px;transform:translateX(-50%);
        width:0;height:0;border-left:6px solid transparent;
        border-right:6px solid transparent;border-top:10px solid #111827;
      "></div>
    </div>
  `,
  iconSize: [40, 52],
  iconAnchor: [20, 50],
});

interface ResidenceLocationMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export default function ResidenceLocationMap({
  latitude,
  longitude,
  className,
}: ResidenceLocationMapProps) {
  return (
    <div className={className ?? "h-96 w-full overflow-hidden rounded-3xl"}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={homeIcon} />
      </MapContainer>
    </div>
  );
}