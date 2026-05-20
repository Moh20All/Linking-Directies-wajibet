"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getSchoolSettings,
  updateSchoolSettings,
  SchoolSettings,
  SchoolSettingsPayload,
} from "@/services/masterService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  MapPin,
  Building,
  Key,
  Map as MapIcon,
  Settings,
} from "lucide-react";
import "leaflet/dist/leaflet.css"; // Ensure you have leaflet CSS
import L from "leaflet";
import { useLanguage } from "@/context/language-context";

// A Map component to encapsulate Leaflet logic
const MapPicker = ({
  location,
  onLocationChange,
}: {
  location: { lat: number; lng: number };
  onLocationChange: (loc: { lat: number; lng: number }) => void;
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize the map
      const map = L.map(mapContainerRef.current).setView(
        [location.lat, location.lng],
        13
      );
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom Icon
      const customIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // Initialize marker
      const marker = L.marker([location.lat, location.lng], {
        draggable: true,
        icon: customIcon,
      }).addTo(map);
      markerRef.current = marker;

      // Handle map click
      map.on("click", (e) => {
        const newLatLng = e.latlng;
        marker.setLatLng(newLatLng);
        onLocationChange({ lat: newLatLng.lat, lng: newLatLng.lng });
      });

      // Handle marker drag
      marker.on("dragend", () => {
        const newLatLng = marker.getLatLng();
        onLocationChange({ lat: newLatLng.lat, lng: newLatLng.lng });
      });
    }
  }, []); // Run only once

  useEffect(() => {
    // Update map view when location prop changes from outside (e.g., manual input)
    if (mapRef.current && markerRef.current) {
      const newLatLng = L.latLng(location.lat, location.lng);
      if (!mapRef.current.getBounds().contains(newLatLng)) {
        mapRef.current.setView(newLatLng, mapRef.current.getZoom());
      }
      markerRef.current.setLatLng(newLatLng);
    }
  }, [location]);

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full rounded-lg z-0"
      style={{ minHeight: "300px" }}
    />
  );
};

export default function SchoolSettings() {
  const { getFreshToken } = useAuth();
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [formData, setFormData] = useState({ name: "", lat: "", lng: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getFreshToken();
        if (!token) throw new Error("Authentication failed.");
        const data = await getSchoolSettings(token);
        setSettings(data);
        setFormData({
          name: data.information.name,
          lat: data.information.location.x.toString(),
          lng: data.information.location.y.toString(),
        });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(msg);
        setFormData({ name: "", lat: "34.85", lng: "5.75" }); // Default to Biskra
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMapLocationChange = ({
    lat,
    lng,
  }: {
    lat: number;
    lng: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload: SchoolSettingsPayload = {
      name: formData.name,
      location: {
        x: parseFloat(formData.lat),
        y: parseFloat(formData.lng),
      },
    };

    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication failed.");
      const updatedSettings = await updateSchoolSettings(token, payload);
      setSettings(updatedSettings);
      setFormData({
        name: updatedSettings.information.name,
        lat: updatedSettings.information.location.x.toString(),
        lng: updatedSettings.information.location.y.toString(),
      });
      setSuccess("School settings updated successfully!");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to save settings.";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-purple-600 font-medium">
          Loading School Settings...
        </span>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <form onSubmit={handleSubmit}>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-600" />
            {t.school_settings_title}
          </CardTitle>
          <CardDescription>
            {t.school_settings_description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Form Fields */}
            <div className="space-y-6">
              {/* General Info Card */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Building className="w-5 h-5 text-gray-500" />{t.school_settings_general_info}
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="name">{t.school_settings_school_name}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.school_settings_school_type}</Label>
                    <Input
                      value={settings?.information.type.toUpperCase()}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.school_settings_derivation_key}</Label>
                    <Input
                      value={settings?.derivationKey}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Location Info Card */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" /> {t.school_settings_location_coords}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat">{t.school_settings_latitude}</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) =>
                        setFormData({ ...formData, lat: e.target.value })
                      }
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">{t.school_settings_longitude}</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      value={formData.lng}
                      onChange={(e) =>
                        setFormData({ ...formData, lng: e.target.value })
                      }
                      disabled={isSaving}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {t.school_settings_drag_pin}
                </p>
              </div>
            </div>

            {/* Right Column: Map */}
            <div className="space-y-4 p-4 border rounded-lg flex flex-col">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-gray-500" /> {t.school_settings_location_map}
              </h3>
              <div className="flex-grow">
                <MapPicker
                  location={{
                    lat: parseFloat(formData.lat) || 34.85,
                    lng: parseFloat(formData.lng) || 5.75,
                  }}
                  onLocationChange={handleMapLocationChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t p-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-auto">
            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 border-green-200 text-green-800 w-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </div>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {t.school_settings_save_changes}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
