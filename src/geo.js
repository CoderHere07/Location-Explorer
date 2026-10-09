const FALLBACK = { lat: 31.5204, lng: 74.3587 };

export function getLocation() {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) return resolve({ ...FALLBACK, fallback: true });

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        console.warn("Geolocation failed:", err.message);
        resolve({ ...FALLBACK, fallback: true });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}