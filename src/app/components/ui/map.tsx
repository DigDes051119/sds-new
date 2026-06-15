import MapLibreGL, { type PopupOptions, type MarkerOptions } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "./utils";

// Custom elegant carto light style for our aesthetic design
const defaultStyles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

type Theme = "light" | "dark";

type MapContextValue = {
  map: MapLibreGL.Map | null;
  isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a Map component");
  }
  return context;
}

type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};

type MapStyleOption = string | MapLibreGL.StyleSpecification;
type MapRef = MapLibreGL.Map;

type MapProps = {
  children?: ReactNode;
  className?: string;
  theme?: Theme;
  styles?: {
    light?: MapStyleOption;
    dark?: MapStyleOption;
  };
  projection?: MapLibreGL.ProjectionSpecification;
  viewport?: Partial<MapViewport>;
  onViewportChange?: (viewport: MapViewport) => void;
  loading?: boolean;
} & Omit<MapLibreGL.MapOptions, "container" | "style">;

function DefaultLoader() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/5 backdrop-blur-xs">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-[#0000FF] animate-ping rounded-full" />
        <span className="w-1.5 h-1.5 bg-[#0000FF] animate-ping rounded-full [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 bg-[#0000FF] animate-ping rounded-full [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function getViewport(map: MapLibreGL.Map): MapViewport {
  const center = map.getCenter();
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
}

export const Map = forwardRef<MapRef, MapProps>(function Map(
  {
    children,
    className,
    theme = "light",
    styles,
    projection,
    viewport,
    onViewportChange,
    loading = false,
    ...props
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<MapLibreGL.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const currentStyleRef = useRef<MapStyleOption | null>(null);
  const styleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const internalUpdateRef = useRef(false);

  const isControlled = viewport !== undefined && onViewportChange !== undefined;

  const onViewportChangeRef = useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles],
  );

  useImperativeHandle(ref, () => mapInstance as MapLibreGL.Map, [mapInstance]);

  const clearStyleTimeout = useCallback(() => {
    if (styleTimeoutRef.current) {
      clearTimeout(styleTimeoutRef.current);
      styleTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const initialStyle = theme === "dark" ? mapStyles.dark : mapStyles.light;
    currentStyleRef.current = initialStyle;

    const map = new MapLibreGL.Map({
      container: containerRef.current,
      style: initialStyle,
      renderWorldCopies: false,
      attributionControl: false,
      ...props,
      ...viewport,
    });

    const styleDataHandler = () => {
      clearStyleTimeout();
      styleTimeoutRef.current = setTimeout(() => {
        setIsStyleLoaded(true);
        if (projection) {
          map.setProjection(projection);
        }
      }, 100);
    };
    const loadHandler = () => setIsLoaded(true);

    const handleMove = () => {
      if (internalUpdateRef.current) return;
      onViewportChangeRef.current?.(getViewport(map));
    };

    map.on("load", loadHandler);
    map.on("styledata", styleDataHandler);
    map.on("move", handleMove);
    setMapInstance(map);

    return () => {
      clearStyleTimeout();
      map.off("load", loadHandler);
      map.off("styledata", styleDataHandler);
      map.off("move", handleMove);
      map.remove();
      setIsLoaded(false);
      setIsStyleLoaded(false);
      setMapInstance(null);
    };
  }, []);

  useEffect(() => {
    if (!mapInstance || !isControlled || !viewport) return;
    if (mapInstance.isMoving()) return;

    const current = getViewport(mapInstance);
    const next = {
      center: viewport.center ?? current.center,
      zoom: viewport.zoom ?? current.zoom,
      bearing: viewport.bearing ?? current.bearing,
      pitch: viewport.pitch ?? current.pitch,
    };

    if (
      next.center[0] === current.center[0] &&
      next.center[1] === current.center[1] &&
      next.zoom === current.zoom &&
      next.bearing === current.bearing &&
      next.pitch === current.pitch
    ) {
      return;
    }

    internalUpdateRef.current = true;
    mapInstance.jumpTo(next);
    internalUpdateRef.current = false;
  }, [mapInstance, isControlled, viewport]);

  useEffect(() => {
    if (!mapInstance) return;

    const newStyle = theme === "dark" ? mapStyles.dark : mapStyles.light;

    if (currentStyleRef.current === newStyle) return;

    clearStyleTimeout();
    currentStyleRef.current = newStyle;
    setIsStyleLoaded(false);

    mapInstance.setStyle(newStyle, { diff: true });
  }, [mapInstance, theme, mapStyles, clearStyleTimeout]);

  const contextValue = useMemo(
    () => ({
      map: mapInstance,
      isLoaded: isLoaded && isStyleLoaded,
    }),
    [mapInstance, isLoaded, isStyleLoaded],
  );

  return (
    <MapContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn("relative h-full w-full", className)}
      >
        {(!isLoaded || loading) && <DefaultLoader />}
        {mapInstance && children}
      </div>
    </MapContext.Provider>
  );
});

type MarkerContextValue = {
  marker: MapLibreGL.Marker;
  map: MapLibreGL.Map | null;
};

const MarkerContext = createContext<MarkerContextValue | null>(null);

export function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error("Marker components must be used within MapMarker");
  }
  return context;
}

type MapMarkerProps = {
  longitude: number;
  latitude: number;
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onDragStart?: (lngLat: { lng: number; lat: number }) => void;
  onDrag?: (lngLat: { lng: number; lat: number }) => void;
  onDragEnd?: (lngLat: { lng: number; lat: number }) => void;
} & Omit<MarkerOptions, "element">;

export function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd,
  draggable = false,
  ...markerOptions
}: MapMarkerProps) {
  const { map } = useMap();

  const callbacksRef = useRef({
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
  });
  callbacksRef.current = {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
  };

  const marker = useMemo(() => {
    const markerInstance = new MapLibreGL.Marker({
      ...markerOptions,
      element: document.createElement("div"),
      draggable,
    }).setLngLat([longitude, latitude]);

    const handleClick = (e: MouseEvent) => callbacksRef.current.onClick?.(e);
    const handleMouseEnter = (e: MouseEvent) =>
      callbacksRef.current.onMouseEnter?.(e);
    const handleMouseLeave = (e: MouseEvent) =>
      callbacksRef.current.onMouseLeave?.(e);

    markerInstance.getElement()?.addEventListener("click", handleClick);
    markerInstance
      .getElement()
      ?.addEventListener("mouseenter", handleMouseEnter);
    markerInstance
      .getElement()
      ?.addEventListener("mouseleave", handleMouseLeave);

    const handleDragStart = () => {
      const lngLat = markerInstance.getLngLat();
      callbacksRef.current.onDragStart?.({ lng: lngLat.lng, lat: lngLat.lat });
    };
    const handleDrag = () => {
      const lngLat = markerInstance.getLngLat();
      callbacksRef.current.onDrag?.({ lng: lngLat.lng, lat: lngLat.lat });
    };
    const handleDragEnd = () => {
      const lngLat = markerInstance.getLngLat();
      callbacksRef.current.onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat });
    };

    if (draggable) {
      markerInstance.on("dragstart", handleDragStart);
      markerInstance.on("drag", handleDrag);
      markerInstance.on("dragend", handleDragEnd);
    }

    return markerInstance;
  }, [longitude, latitude, draggable]);

  useEffect(() => {
    if (!map) return;
    marker.addTo(map);
    return () => {
      marker.remove();
    };
  }, [map, marker]);

  const contextValue = useMemo(
    () => ({
      marker,
      map,
    }),
    [marker, map],
  );

  return (
    <MarkerContext.Provider value={contextValue}>
      {createPortal(children, marker.getElement())}
    </MarkerContext.Provider>
  );
}

type MarkerContentProps = {
  children: ReactNode;
  className?: string;
};

export function MarkerContent({ children, className }: MarkerContentProps) {
  return <div className={cn("cursor-pointer", className)}>{children}</div>;
}

type MapPopupProps = {
  longitude?: number;
  latitude?: number;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  permanent?: boolean;
} & PopupOptions;

export function MapPopup({
  longitude,
  latitude,
  children,
  className,
  onClose,
  permanent = false,
  ...popupOptions
}: MapPopupProps) {
  const { map } = useMap();
  const markerContext = useContext(MarkerContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<MapLibreGL.Popup | null>(null);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const popup = useMemo(() => {
    const popupInstance = new MapLibreGL.Popup({
      closeButton: false,
      ...popupOptions,
    });
    popupInstance.on("close", () => onCloseRef.current?.());
    return popupInstance;
  }, []);

  useEffect(() => {
    if (!map) return;

    if (markerContext?.marker) {
      if (permanent) {
        popup.setLngLat(markerContext.marker.getLngLat()).addTo(map);
      } else {
        markerContext.marker.setPopup(popup);
      }
    } else if (longitude !== undefined && latitude !== undefined) {
      popup.setLngLat([longitude, latitude]).addTo(map);
    }

    popupRef.current = popup;

    return () => {
      popup.remove();
      if (markerContext?.marker) {
        markerContext.marker.setPopup(null as any);
      }
      popupRef.current = null;
    };
  }, [map, markerContext, longitude, latitude, popup, permanent]);

  useEffect(() => {
    if (!popupRef.current || !containerRef.current) return;
    popupRef.current.setDOMContent(containerRef.current);
  }, [children]);

  return (
    <div className="hidden">
      <div ref={containerRef} className={cn("p-1", className)}>
        {children}
      </div>
    </div>
  );
}
