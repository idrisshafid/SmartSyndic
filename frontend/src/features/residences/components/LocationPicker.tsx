import { useCallback, useEffect, useRef, useState,} from "react";

import {  MapContainer, TileLayer,  useMap, useMapEvents,} from "react-leaflet";

import type { LatLng,  Map as LeafletMap,} from "leaflet";

import { Search, LocateFixed,  Loader2,  MapPin,} from "lucide-react";

// ==============================
// Types
// ==============================
export interface PickedLocation {
  latitude:number;
  longitude:number;
  address?:string;
  city?:string;
  postalCode?:string;
}


interface LocationPickerProps {
  
  initialLocation?:{  latitude:number; longitude:number;};

  onChange:(location:PickedLocation)=>void;
}

interface SearchResult{

 display_name:string;lat:string; lon:string;}

// ==============================
// Default Fes
// ==============================

const DEFAULT_CENTER:[number,number]=[ 34.0331, -5.0003];

const DEFAULT_ZOOM = 13;

// ==============================
// Reverse Geocoding
// ==============================
async function reverseGeocode(lat:number,lon:number){
try{

const response = await fetch(
`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);

if(!response.ok)    return {};

const data = await response.json();

const address=data.address ?? {};

return {

address:data.display_name,

city: address.city ??  address.town ?? address.village ??  address.municipality ??
address.county,

postalCode:
address.postcode, };      }

catch{
return {}; }}
// ==============================
// Search Address
// ==============================

async function searchAddress(
query:string
):Promise<SearchResult[]>{

try{

const response = await fetch(

`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`

);

if(!response.ok)  return [];
return await response.json();    }

catch{ return [];}   }

// ==============================
// Leaflet controller
// ==============================

function MapController({ onMapReady , onMoveEnd , }:
  
{ onMapReady:(map:LeafletMap)=>void;

  onMoveEnd:(center:LatLng)=>void;    })     {

const map = useMap();

useEffect(  () => { onMapReady(map);   }   ,   [map,onMapReady]);

useMapEvents( {   moveend(){   
   
  onMoveEnd(map.getCenter()  ) ; } } )   ;

return null;     }

// ==============================
// Component
// ==============================

export default function LocationPicker({

initialLocation,onChange,}:LocationPickerProps
){

const mapRef=  useRef<LeafletMap|null>(null);

const debounceRef= useRef<ReturnType<typeof setTimeout>|null>(null);

const searchDebounceRef=  useRef<ReturnType<typeof setTimeout>|null>(null);


const [coords, setCoords] = useState<[number, number] > ( initialLocation
    
  ? [Number(initialLocation.latitude),
       Number(initialLocation.longitude)   ,  ]  : DEFAULT_CENTER);

const [resolvedAddress,setResolvedAddress]=useState<string|null>(null);

const [isResolving,setIsResolving]=useState(false);

const [isLocating,setIsLocating]=useState(false);


const [searchQuery,setSearchQuery]=useState("");

const [searchResults,setSearchResults]=useState<SearchResult[]>([]);

const [isSearching,setIsSearching]=useState(false);

const [showResults,setShowResults]=useState(false);

// ==============================
// Reverse geo after map movement
// ==============================

const performReverseGeocode =useCallback(

async(lat:number,lng:number)=>{

const geo =await reverseGeocode(lat,lng);

setResolvedAddress(geo.address ?? null);

setIsResolving(false);

onChange({latitude:lat,longitude:lng,address:geo.address,

city:geo.city,postalCode:geo.postalCode,   }); },[onChange]);

const scheduleResolve =

useCallback((lat:number,lng:number)=>{

setIsResolving(true);

if(debounceRef.current)

clearTimeout(debounceRef.current);

debounceRef.current =setTimeout(()=>{

performReverseGeocode(lat,lng);  },500);  } , [performReverseGeocode]);

const handleMoveEnd =useCallback(

(center:LatLng)=>{

setCoords([center.lat,center.lng]);

scheduleResolve(center.lat,center.lng);},[scheduleResolve]);

const handleMapReady =useCallback(

(map:LeafletMap)=>{mapRef.current=map;},[]);


// ONLY CLEANUP
// no setState here

useEffect(()=>{


return()=>{    if(debounceRef.current)

clearTimeout(debounceRef.current);

if(searchDebounceRef.current)

clearTimeout(searchDebounceRef.current);
};

},[]);
  // ==============================
  // GPS current location
  // ==============================

  const handleLocateMe = () => {

    if (!navigator.geolocation)
     
      return;setIsLocating(true);

    navigator.geolocation.getCurrentPosition(

      (position)=>{ const {    latitude,     longitude } = position.coords;

        mapRef.current?.flyTo([  latitude, longitude],16);

        setIsLocating(false);      },

      ()=>{        setIsLocating(false);},

      {
        enableHighAccuracy:true,
        timeout:8000
      }

    );  };


  // ==============================
  // Search
  // ==============================

  const handleSearchChange = (
    value:string
  )=>{


    setSearchQuery(value);



    if(searchDebounceRef.current)

      clearTimeout(
        searchDebounceRef.current
      );



    if(value.trim().length < 3){

      setSearchResults([]);

      setShowResults(false);

      return;

    }



    searchDebounceRef.current =
    setTimeout(async()=>{


      setIsSearching(true);



      const results =
      await searchAddress(value);



      setSearchResults(results);


      setShowResults(true);


      setIsSearching(false);



    },400);



  };




  const handleSelectResult = (
    result:SearchResult
  )=>{


    const lat =
    Number(result.lat);


    const lon =
    Number(result.lon);



    mapRef.current?.flyTo(

      [
        lat,
        lon
      ],

      16

    );



    setSearchQuery(
      result.display_name
    );


    setShowResults(false);



  };





  return (

    <div className="
      relative
      h-full
      w-full
      overflow-hidden
    ">



      {/* ======================
          SEARCH
      ======================= */}

      <div
      className="
      absolute
      top-4
      left-4
      right-4
      z-[1000]
      "
      >


        <div
        className="
        relative
        "
        >


          <div
          className="
          flex
          items-center
          gap-2
          rounded-2xl
          bg-white
          px-4
          py-3
          shadow-lg
          "
          >


            <Search
            size={18}
            className="
            text-slate-400
            "
            />



            <input

            value={searchQuery}

            onChange={
              (e)=>
              handleSearchChange(
                e.target.value
              )
            }


            onFocus={()=>
              searchResults.length>0 &&
              setShowResults(true)
            }


            placeholder="
            Search address...
            "


            className="
            w-full
            bg-transparent
            text-sm
            outline-none
            "
            
            />



            {
            isSearching &&

            <Loader2
            size={16}
            className="
            animate-spin
            text-slate-400
            "
            />

            }



          </div>




          {
          showResults &&
          searchResults.length>0 &&


          <div
          className="
          absolute
          mt-2
          w-full
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-lg
          "
          >


          {
          searchResults.map(
            (result,index)=>(


            <button

            key={
              `${result.lat}-${index}`
            }


            onClick={()=>
              handleSelectResult(result)
            }


            className="
            flex
            w-full
            gap-2
            border-b
            px-4
            py-3
            text-left
            text-sm
            hover:bg-slate-50
            "
            >


              <MapPin
              size={15}
              />

              <span>
              {result.display_name}
              </span>


            </button>


            )

          )

          }


          </div>

          }


        </div>


      </div>





      {/* ======================
            MAP
      ======================= */}



      <MapContainer

      center={coords}

      zoom={DEFAULT_ZOOM}

      scrollWheelZoom

      className="
      h-full
      w-full
      "

      >



        <TileLayer

        attribution="
        © OpenStreetMap contributors
        "

        url="
        https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
        "

        />



        <MapController

        onMapReady={handleMapReady}

        onMoveEnd={handleMoveEnd}

        />


      </MapContainer>






      {/* ======================
          CENTER PIN
          Airbnb style
      ======================= */}



      <div

      className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      z-[1000]
      -translate-x-1/2
      -translate-y-full
      "

      >


        <MapPin

        size={42}

        fill="#f97316"

        className="
        text-orange-500
        drop-shadow-lg
        "

        />


      </div>







      {/* ======================
          MY LOCATION BUTTON
      ======================= */}


      <button

      onClick={handleLocateMe}

      disabled={isLocating}


      className="
      absolute
      right-4
      bottom-28
      z-[1000]
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-full
      bg-white
      shadow-lg
      hover:bg-slate-50
      disabled:opacity-50
      "

      >


      {
      isLocating

      ?

      <Loader2
      size={18}
      className="animate-spin"
      />

      :

      <LocateFixed
      size={18}
      />

      }



      </button>






      {/* ======================
          ADDRESS INFO
      ======================= */}



      <div

      className="
      absolute
      bottom-4
      left-4
      right-4
      z-[1000]
      rounded-2xl
      bg-white
      px-4
      py-3
      shadow-lg
      "

      >


        <div
        className="
        flex
        gap-2
        "
        >


          <MapPin

          size={16}

          className="
          text-orange-500
          "

          />



          <div>


          {
          isResolving

          ?

          <p
          className="
          text-sm
          text-slate-400
          "
          >
          Locating...
          </p>


          :


          <p
          className="
          max-w-md
          truncate
          text-sm
          font-medium
          "
          >

          {
          resolvedAddress ??
          "Move map to choose location"
          }

          </p>


          }



          <p
          className="
          font-mono
          text-xs
          text-slate-400
          "
          >

          {coords[0].toFixed(5)}
          ,
          {coords[1].toFixed(5)}

          </p>


          </div>


        </div>


      </div>




    </div>

  );


}