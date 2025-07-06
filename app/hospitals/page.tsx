'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation, 
  Heart, 
  AlertCircle, 
  Search,
  Crosshair,
  Car,
  Globe,
  Mail,
  ExternalLink,
  Loader2,
  Building2,
  Pill,
  Stethoscope,
  Syringe,
  Eye,
  Brain
} from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
    </div>
  )
})

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

const facilityTypes = [
  { value: 'all', label: 'All Facilities', icon: Building2 },
  { value: 'hospital', label: 'Hospitals', icon: Heart },
  { value: 'clinic', label: 'Clinics', icon: Stethoscope },
  { value: 'pharmacy', label: 'Pharmacies', icon: Pill },
  { value: 'dental', label: 'Dental', icon: Stethoscope },
  { value: 'optical', label: 'Optical', icon: Eye },
  { value: 'laboratory', label: 'Laboratories', icon: Syringe },
  { value: 'mental_health', label: 'Mental Health', icon: Brain },
  { value: 'urgent_care', label: 'Urgent Care', icon: AlertCircle }
]

export default function HealthcareFacilityFinderPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null)
  const [searchRadius, setSearchRadius] = useState(10) // km
  const [filterEmergency, setFilterEmergency] = useState(false)
  const [selectedFacilityType, setSelectedFacilityType] = useState('all')
  const [error, setError] = useState<string | null>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    setIsVisible(true)
    getUserLocation()
  }, [])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      setError(null)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          findNearbyFacilities(latitude, longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          setError('Unable to get your location. Please enable location services.')
          // Fallback to a default location
          const defaultLocation = { lat: 40.7128, lng: -74.0060 } // New York
          setUserLocation(defaultLocation)
          findNearbyFacilities(defaultLocation.lat, defaultLocation.lng)
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const getFacilityTypeQuery = () => {
    const radius = searchRadius * 1000 // Convert to meters
    const lat = userLocation?.lat || 0
    const lng = userLocation?.lng || 0
    
    if (selectedFacilityType === 'all') {
      return `
        [out:json][timeout:30];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          relation["amenity"="hospital"](around:${radius},${lat},${lng});
          node["healthcare"="hospital"](around:${radius},${lat},${lng});
          way["healthcare"="hospital"](around:${radius},${lat},${lng});
          relation["healthcare"="hospital"](around:${radius},${lat},${lng});
          
          node["amenity"="clinic"](around:${radius},${lat},${lng});
          way["amenity"="clinic"](around:${radius},${lat},${lng});
          relation["amenity"="clinic"](around:${radius},${lat},${lng});
          node["healthcare"="clinic"](around:${radius},${lat},${lng});
          way["healthcare"="clinic"](around:${radius},${lat},${lng});
          relation["healthcare"="clinic"](around:${radius},${lat},${lng});
          
          node["amenity"="pharmacy"](around:${radius},${lat},${lng});
          way["amenity"="pharmacy"](around:${radius},${lat},${lng});
          relation["amenity"="pharmacy"](around:${radius},${lat},${lng});
          
          node["healthcare"="dentist"](around:${radius},${lat},${lng});
          way["healthcare"="dentist"](around:${radius},${lat},${lng});
          relation["healthcare"="dentist"](around:${radius},${lat},${lng});
          
          node["healthcare"="optometrist"](around:${radius},${lat},${lng});
          way["healthcare"="optometrist"](around:${radius},${lat},${lng});
          relation["healthcare"="optometrist"](around:${radius},${lat},${lng});
          
          node["healthcare"="laboratory"](around:${radius},${lat},${lng});
          way["healthcare"="laboratory"](around:${radius},${lat},${lng});
          relation["healthcare"="laboratory"](around:${radius},${lat},${lng});
          
          node["healthcare"="psychiatrist"](around:${radius},${lat},${lng});
          way["healthcare"="psychiatrist"](around:${radius},${lat},${lng});
          relation["healthcare"="psychiatrist"](around:${radius},${lat},${lng});
          
          node["healthcare"="urgent_care"](around:${radius},${lat},${lng});
          way["healthcare"="urgent_care"](around:${radius},${lat},${lng});
          relation["healthcare"="urgent_care"](around:${radius},${lat},${lng});
          
          node["healthcare"](around:${radius},${lat},${lng});
          way["healthcare"](around:${radius},${lat},${lng});
          relation["healthcare"](around:${radius},${lat},${lng});
          
          node["amenity"~"^(hospital|clinic|pharmacy|doctors)$"](around:${radius},${lat},${lng});
          way["amenity"~"^(hospital|clinic|pharmacy|doctors)$"](around:${radius},${lat},${lng});
          relation["amenity"~"^(hospital|clinic|pharmacy|doctors)$"](around:${radius},${lat},${lng});
        );
        out center;
      `
    } else {
      // Specific facility type queries
      const queries: { [key: string]: string } = {
        hospital: `
          [out:json][timeout:30];
          (
            node["amenity"="hospital"](around:${radius},${lat},${lng});
            way["amenity"="hospital"](around:${radius},${lat},${lng});
            relation["amenity"="hospital"](around:${radius},${lat},${lng});
            node["healthcare"="hospital"](around:${radius},${lat},${lng});
            way["healthcare"="hospital"](around:${radius},${lat},${lng});
            relation["healthcare"="hospital"](around:${radius},${lat},${lng});
          );
          out center;
        `,
        clinic: `
          [out:json][timeout:30];
          (
            node["amenity"="clinic"](around:${radius},${lat},${lng});
            way["amenity"="clinic"](around:${radius},${lat},${lng});
            relation["amenity"="clinic"](around:${radius},${lat},${lng});
            node["healthcare"="clinic"](around:${radius},${lat},${lng});
            way["healthcare"="clinic"](around:${radius},${lat},${lng});
            relation["healthcare"="clinic"](around:${radius},${lat},${lng});
          );
          out center;
        `,
        pharmacy: `
          [out:json][timeout:30];
          (
            node["amenity"="pharmacy"](around:${radius},${lat},${lng});
            way["amenity"="pharmacy"](around:${radius},${lat},${lng});
            relation["amenity"="pharmacy"](around:${radius},${lat},${lng});
          );
          out center;
        `,
        dental: `
          [out:json][timeout:30];
          (
            node["healthcare"="dentist"](around:${radius},${lat},${lng});
            way["healthcare"="dentist"](around:${radius},${lat},${lng});
            relation["healthcare"="dentist"](around:${radius},${lat},${lng});
          );
          out center;
        `,
        optical: `
          [out:json][timeout:30];
          (
            node["healthcare"="optometrist"](around:${radius},${lat},${lng});
            way["healthcare"="optometrist"](around:${radius},${lat},${lng});
            relation["healthcare"="optometrist"](around:${radius},${lat},${lng});
          );
          out center;
        `,
        laboratory: `
          [out:json][timeout:30];
          (
            node["healthcare"="laboratory"](around:${radius},${lat},${lng});
            way["healthcare"="laboratory"](around:${radius},${lat},${lng});
            relation["healthcare"="laboratory"](around:${radius},${lat},${lng});
          );
          out center;
        `,
        mental_health: `
          [out:json][timeout:30];
          (
            node["healthcare"="psychiatrist"](around:${radius},${lat},${lng});
            way["healthcare"="psychiatrist"](around:${radius},${lat},${lng});
            relation["healthcare"="psychiatrist"](around:${radius},${lat},${lng});
          );
          out center;
        `,
        urgent_care: `
          [out:json][timeout:30];
          (
            node["healthcare"="urgent_care"](around:${radius},${lat},${lng});
            way["healthcare"="urgent_care"](around:${radius},${lat},${lng});
            relation["healthcare"="urgent_care"](around:${radius},${lat},${lng});
          );
          out center;
        `
      }
      return queries[selectedFacilityType] || queries.hospital
    }
  }

  const getFacilityType = (tags: any): HealthcareFacility['type'] => {
    if (tags?.amenity === 'hospital' || tags?.healthcare === 'hospital') return 'hospital'
    if (tags?.amenity === 'clinic' || tags?.healthcare === 'clinic') return 'clinic'
    if (tags?.amenity === 'pharmacy') return 'pharmacy'
    if (tags?.healthcare === 'dentist') return 'dental'
    if (tags?.healthcare === 'optometrist') return 'optical'
    if (tags?.healthcare === 'laboratory') return 'laboratory'
    if (tags?.healthcare === 'psychiatrist') return 'mental_health'
    if (tags?.healthcare === 'urgent_care') return 'urgent_care'
    return 'clinic'
  }

  const getFacilityCategory = (type: HealthcareFacility['type']): string => {
    const categories: { [key: string]: string } = {
      hospital: 'Hospital',
      clinic: 'Medical Clinic',
      pharmacy: 'Pharmacy',
      dental: 'Dental Clinic',
      optical: 'Optical Center',
      laboratory: 'Medical Laboratory',
      mental_health: 'Mental Health Center',
      urgent_care: 'Urgent Care'
    }
    return categories[type] || 'Healthcare Facility'
  }

  const findNearbyFacilities = async (lat: number, lng: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const query = getFacilityTypeQuery()
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch facility data')
      }

      const data = await response.json()
      
      const facilityList: HealthcareFacility[] = []
      
      data.elements.forEach((element: any) => {
        let coordinates
        if (element.type === 'node') {
          coordinates = { lat: element.lat, lng: element.lon }
        } else if (element.center) {
          coordinates = { lat: element.center.lat, lng: element.center.lon }
        } else {
          return // Skip if no coordinates
        }

        const distance = haversineDistance(lat, lng, coordinates.lat, coordinates.lng)
        
        // Filter by distance
        if (distance <= searchRadius) {
          const facilityType = getFacilityType(element.tags)
          const facility: HealthcareFacility = {
            id: element.id.toString(),
            name: element.tags?.name || element.tags?.['name:en'] || 'Unknown Facility',
            address: element.tags?.['addr:street'] ? 
              `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street']}, ${element.tags['addr:city'] || ''}` :
              'Address not available',
            phone: element.tags?.phone || element.tags?.['contact:phone'],
            website: element.tags?.website,
            distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
            emergency: element.tags?.emergency === 'yes' || element.tags?.['healthcare:speciality']?.includes('emergency'),
            coordinates,
            hours: element.tags?.['opening_hours'],
            services: [],
            type: facilityType,
            category: getFacilityCategory(facilityType)
          }

          // Add services based on tags
          if (element.tags?.['healthcare:speciality']) {
            facility.services = element.tags['healthcare:speciality'].split(';')
          }

          facilityList.push(facility)
        }
      })

      // Sort by distance
      facilityList.sort((a, b) => a.distance - b.distance)
      setFacilities(facilityList)
      
      if (facilityList.length === 0) {
        setError('No healthcare facilities found in your area. Try increasing the search radius or changing the facility type.')
      }
    } catch (error) {
      console.error('Error finding facilities:', error)
      setError('Failed to fetch facility data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRadiusChange = (newRadius: number) => {
    setSearchRadius(newRadius)
    if (userLocation) {
      findNearbyFacilities(userLocation.lat, userLocation.lng)
    }
  }

  const handleFacilityTypeChange = (newType: string) => {
    setSelectedFacilityType(newType)
    if (userLocation) {
      findNearbyFacilities(userLocation.lat, userLocation.lng)
    }
  }

  const getDirections = (facility: HealthcareFacility) => {
    const { lat, lng } = facility.coordinates
    const url = `https://www.openstreetmap.org/directions?from=${userLocation?.lat},${userLocation?.lng}&to=${lat},${lng}`
    window.open(url, '_blank')
  }

  const callFacility = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  const filteredFacilities = facilities.filter(facility => {
    if (selectedFacilityType !== 'all' && facility.type !== selectedFacilityType) return false
    if (filterEmergency && !facility.emergency) return false
    return facility.distance <= searchRadius
  })

  const getFacilityIcon = (type: HealthcareFacility['type']) => {
    const icons: { [key: string]: any } = {
      hospital: Heart,
      clinic: Stethoscope,
      pharmacy: Pill,
      dental: Stethoscope,
      optical: Eye,
      laboratory: Syringe,
      mental_health: Brain,
      urgent_care: AlertCircle
    }
    return icons[type] || Building2
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-primary-600 mr-3" />
                <h1 className="text-4xl font-bold text-gray-900">Healthcare Facility Finder</h1>
              </div>
              <p className="text-xl text-gray-600 mb-6">
                Find hospitals, clinics, pharmacies, and more near you using real OpenStreetMap data
              </p>
            </div>
            
            {/* Location Status */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={getUserLocation}
                disabled={loading}
                className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="w-5 h-5" />
                    <span>Use My Location</span>
                  </>
                )}
              </button>
              
              {userLocation && (
                <div className="flex items-center space-x-2 text-green-600">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Location Found</span>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="space-y-6 mb-8">
              {/* Search Radius */}
              <div className="flex items-center justify-center space-x-4">
                <label className="text-gray-700 text-sm font-medium">Search Radius:</label>
                <div className="flex space-x-2">
                  {[5, 10, 20, 50].map((radius) => (
                    <button
                      key={radius}
                      onClick={() => handleRadiusChange(radius)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        searchRadius === radius
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {radius} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Facility Type Buttons */}
              <div className="space-y-3">
                <label className="text-gray-700 text-sm font-medium text-center block">Facility Types:</label>
                <div className="flex flex-wrap justify-center gap-3">
                  {facilityTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.value}
                        onClick={() => handleFacilityTypeChange(type.value)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                          selectedFacilityType === type.value
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Emergency Filter */}
              <div className="flex items-center justify-center">
                <label className="flex items-center space-x-3 text-gray-600 text-sm cursor-pointer hover:text-gray-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterEmergency}
                    onChange={(e) => setFilterEmergency(e.target.checked)}
                    className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                  />
                  <span className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Emergency Services Only</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Map and Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Map */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Map</h2>
                  <div className="h-96 rounded-lg overflow-hidden">
                    {userLocation && (
                      <MapComponent
                        ref={mapRef}
                        userLocation={userLocation}
                        hospitals={filteredFacilities}
                        selectedHospital={selectedFacility}
                        onHospitalSelect={setSelectedFacility}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Facility List */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Nearby Facilities</h2>
                    <div className="text-gray-600 text-sm">
                      {filteredFacilities.length} facilities found
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-16 h-16 animate-spin text-primary-600 mx-auto mb-4" />
                      <p className="text-gray-600">Finding facilities near you...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {filteredFacilities.map((facility) => {
                        const FacilityIcon = getFacilityIcon(facility.type)
                        return (
                          <div
                            key={facility.id}
                            onClick={() => setSelectedFacility(facility)}
                            className={`bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-all duration-300 border ${
                              selectedFacility?.id === facility.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <FacilityIcon className="w-4 h-4 text-primary-600" />
                                  <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                                  {facility.emergency && (
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                      Emergency
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                                    {facility.category}
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-gray-600 text-sm mb-3">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{facility.address}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Navigation className="w-4 h-4" />
                                    <span>{facility.distance} km</span>
                                  </div>
                                </div>

                                {facility.phone && (
                                  <div className="flex items-center space-x-1 text-gray-600 text-sm mb-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{facility.phone}</span>
                                  </div>
                                )}

                                {facility.hours && (
                                  <div className="flex items-center space-x-1 text-gray-600 text-sm mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{facility.hours}</span>
                                  </div>
                                )}

                                {facility.services && facility.services.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {facility.services.slice(0, 3).map((service, index) => (
                                      <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                                        {service}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col space-y-2 ml-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    getDirections(facility)
                                  }}
                                  className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
                                  title="Get Directions"
                                >
                                  <Navigation className="w-4 h-4" />
                                </button>
                                {facility.phone && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      callFacility(facility.phone!)
                                    }}
                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                    title="Call Facility"
                                  >
                                    <Phone className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Alert */}
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Emergency Information</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    In case of a medical emergency, call 911 immediately. This facility finder uses real OpenStreetMap data but should not delay emergency care.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-red-600 font-semibold">Emergency: 911</span>
                    <span className="text-gray-600">Poison Control: 1-800-222-1222</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 