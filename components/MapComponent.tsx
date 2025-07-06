'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface HealthcareFacility {
  id: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  distance: number
  emergency: boolean
  coordinates: {
    lat: number
    lng: number
  }
  hours?: string
  services?: string[]
  type: 'hospital' | 'clinic' | 'pharmacy' | 'dental' | 'optical' | 'laboratory' | 'mental_health' | 'urgent_care'
  category: string
}

interface MapComponentProps {
  userLocation: { lat: number; lng: number }
  hospitals: HealthcareFacility[]
  selectedHospital: HealthcareFacility | null
  onHospitalSelect: (facility: HealthcareFacility | null) => void
}

const MapComponent = forwardRef<any, MapComponentProps>((props, ref) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number) => {
      if (mapInstance.current) {
        mapInstance.current.flyTo([lat, lng], 15)
      }
    }
  }))

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([props.userLocation.lat, props.userLocation.lng], 13)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current)

    // Add user location marker
    const userIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: #3b82f6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })

    L.marker([props.userLocation.lat, props.userLocation.lng], { icon: userIcon })
      .addTo(mapInstance.current)
      .bindPopup('<b>Your Location</b>')

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [props.userLocation])

  useEffect(() => {
    if (!mapInstance.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add facility markers
    props.hospitals.forEach(facility => {
      const isEmergency = facility.emergency
      const isSelected = props.selectedHospital?.id === facility.id

      // Get facility type icon
      const getFacilityIcon = (type: HealthcareFacility['type']) => {
        const icons: { [key: string]: string } = {
          hospital: 'H',
          clinic: 'C',
          pharmacy: 'P',
          dental: 'D',
          optical: 'O',
          laboratory: 'L',
          mental_health: 'M',
          urgent_care: 'U'
        }
        return icons[type] || 'F'
      }

      const facilityIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: ${isEmergency ? '#ef4444' : '#10b981'};
            width: ${isSelected ? '30px' : '25px'};
            height: ${isSelected ? '30px' : '25px'};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: white;
          ">${getFacilityIcon(facility.type)}</div>
        `,
        iconSize: [isSelected ? 30 : 25, isSelected ? 30 : 25],
        iconAnchor: [isSelected ? 15 : 12.5, isSelected ? 15 : 12.5]
      })

      const marker = L.marker([facility.coordinates.lat, facility.coordinates.lng], { icon: facilityIcon })
        .addTo(mapInstance.current!)

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">${facility.name}</h3>
          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">${facility.category}</p>
          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">${facility.address}</p>
          <p style="margin: 0 0 4px 0; color: #059669; font-size: 12px;">${facility.distance} km away</p>
          ${facility.phone ? `<p style="margin: 0 0 4px 0; color: #3b82f6; font-size: 12px;">📞 ${facility.phone}</p>` : ''}
          ${facility.emergency ? '<p style="margin: 0; color: #ef4444; font-size: 12px; font-weight: bold;">🚨 Emergency Services</p>' : ''}
        </div>
      `

      marker.bindPopup(popupContent)

      // Add click handler
      marker.on('click', () => {
        props.onHospitalSelect(facility)
      })

      markersRef.current.push(marker)
    })

    // Fit bounds to show all markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current)
      mapInstance.current.fitBounds(group.getBounds().pad(0.1))
    }
  }, [props.hospitals, props.selectedHospital])

  useEffect(() => {
    if (!mapInstance.current || !props.selectedHospital) return

    // Fly to selected facility
    const { lat, lng } = props.selectedHospital.coordinates
    mapInstance.current.flyTo([lat, lng], 16)
  }, [props.selectedHospital])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-xl"
      style={{ zIndex: 1 }}
    />
  )
})

MapComponent.displayName = 'MapComponent'

export default MapComponent 