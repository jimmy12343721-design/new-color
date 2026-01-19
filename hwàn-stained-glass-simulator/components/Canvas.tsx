import React, { useEffect, useRef, useState } from 'react';
import { SVG_REPO } from '../constants';
import { WorkItem } from '../types';

interface CanvasProps {
  work: WorkItem;
  textureUrl: string | null;
  textureId: string | null;
}

export const Canvas: React.FC<CanvasProps> = ({ work, textureUrl, textureId }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  // Store current texture in ref to access it in event listeners without re-binding
  const currentTextureRef = useRef({ url: textureUrl, id: textureId });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Sync ref with props
  useEffect(() => {
    currentTextureRef.current = { url: textureUrl, id: textureId };
  }, [textureUrl, textureId]);

  // Load SVG
  useEffect(() => {
    const fetchSvg = async () => {
      if (!contentRef.current) return;
      setLoading(true);
      setError(false);
      
      try {
        const res = await fetch(`${SVG_REPO}${encodeURIComponent(work.file)}`);
        if (!res.ok) throw new Error("Failed to load");
        const svgText = await res.text();
        contentRef.current.innerHTML = svgText;
        setupSvgInteraction(contentRef.current.querySelector('svg'));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSvg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work]);

  // Setup Interaction Logic
  const setupSvgInteraction = (svg: SVGSVGElement | null) => {
    if (!svg) return;

    // Ensure full size
    svg.style.width = "100%";
    svg.style.height = "100%";
    
    // Ensure defs exist
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      svg.prepend(defs);
    }

    // Ensure Label Layer exists (and is at the end to be on top)
    let labelGroup = svg.getElementById('labels-layer');
    if (!labelGroup) {
      labelGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      labelGroup.id = 'labels-layer';
      svg.appendChild(labelGroup); // Must be last to be z-index top
    } else {
        // Move to end if it exists but isn't last
        svg.appendChild(labelGroup);
    }

    // Process Paths
    const shapes = svg.querySelectorAll('path, polygon, rect, circle, ellipse');
    shapes.forEach((el) => {
      const element = el as SVGGraphicsElement;
      const fill = element.getAttribute('fill');
      const id = element.id || "";

      // Ignore black lines or specific layers
      if (fill === '#231815' || fill === '#000000' || fill === 'black' || id.includes('圖層')) {
        element.style.pointerEvents = 'none'; // Ensure clicks pass through lines if needed
        return;
      }

      // Initial state
      element.style.cursor = 'pointer';
      // If it doesn't have a texture yet, make it transparent but clickable
      if (!element.getAttribute('data-texture-id')) {
          element.setAttribute('fill', 'rgba(255,255,255,0.01)');
          element.setAttribute('stroke', '#231815');
          element.setAttribute('stroke-width', '1.5px');
      }
      element.style.transition = 'stroke-width 0.1s, filter 0.1s';

      // Events
      element.addEventListener('mouseenter', () => {
        element.style.strokeWidth = '3px';
        element.style.stroke = '#E15A64';
        element.style.filter = 'brightness(0.95)';
      });
      element.addEventListener('mouseleave', () => {
        element.style.strokeWidth = '1.5px';
        element.style.stroke = '#231815';
        element.style.filter = 'none';
      });

      // Click Handler
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        handleShapeClick(element, svg);
      });
    });
  };

  // Handle the logic when a user clicks a shape to color it
  const handleShapeClick = (target: SVGGraphicsElement, svg: SVGSVGElement) => {
    const { url, id } = currentTextureRef.current;
    
    // If no texture selected, maybe shake or alert? For now do nothing.
    if (!url || !id) return;

    // Create Pattern in defs if not exists
    const patternId = `pat-${id}`;
    let defs = svg.querySelector('defs');
    if (!defs) return;

    if (!svg.getElementById(patternId)) {
        const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
        pattern.setAttribute("id", patternId);
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        // Using a fixed reasonable size for glass textures
        pattern.setAttribute("width", "300"); 
        pattern.setAttribute("height", "300");
        
        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttributeNS("http://www.w3.org/1999/xlink", "href", url);
        image.setAttribute("width", "300");
        image.setAttribute("height", "300");
        image.setAttribute("preserveAspectRatio", "xMidYMid slice");
        
        pattern.appendChild(image);
        defs.appendChild(pattern);
    }

    // Apply Fill
    target.setAttribute("fill", `url(#${patternId})`);
    target.setAttribute("data-texture-id", id);
    
    // Reset stroke (remove hover effect immediately or keep it? Keep it is fine)
    target.style.stroke = '#E15A64';

    // Add Label
    updateLabel(target, svg, id);
  };

  const updateLabel = (target: SVGGraphicsElement, svg: SVGSVGElement, text: string) => {
     const labelLayer = svg.getElementById('labels-layer');
     if (!labelLayer) return;

     // Ensure target has an ID for reference
     if (!target.id) {
         target.id = "shape-" + Math.random().toString(36).substr(2, 9);
     }
     const labelId = `label-${target.id}`;
     
     // Remove existing label
     const existing = document.getElementById(labelId);
     if (existing) existing.remove();

     // Calculate Center
     const bbox = target.getBBox();
     // If shape is too small, skip label
     if (bbox.width < 20 || bbox.height < 20) return;

     const cx = bbox.x + bbox.width / 2;
     const cy = bbox.y + bbox.height / 2;

     // Calculate Font Size (smart scaling)
     // Heuristic: Fit within the smaller dimension, reduced ratio for smaller text
     const fontSize = Math.min(bbox.width, bbox.height) / 4.5;
     // Cap max font size
     const finalFontSize = Math.min(Math.max(fontSize, 8), 24);

     const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
     textEl.id = labelId;
     textEl.setAttribute("x", String(cx));
     textEl.setAttribute("y", String(cy));
     textEl.setAttribute("text-anchor", "middle");
     textEl.setAttribute("dominant-baseline", "central");
     textEl.setAttribute("font-family", "'Inter', sans-serif");
     textEl.setAttribute("font-weight", "600"); // Reduced weight
     textEl.setAttribute("font-size", String(finalFontSize));
     textEl.textContent = text;
     
     // Styling for visibility on any background
     textEl.setAttribute("fill", "white");
     textEl.setAttribute("stroke", "rgba(0,0,0,0.5)"); // More transparent stroke
     textEl.setAttribute("stroke-width", "2px"); // Thinner stroke
     textEl.setAttribute("paint-order", "stroke");
     textEl.style.pointerEvents = "none"; // Important: allow clicks to pass through to shape

     labelLayer.appendChild(textEl);
  };

  const handleDownload = async () => {
    if (!contentRef.current || isCapturing) return;
    const svgEl = contentRef.current.querySelector('svg');
    if (!svgEl) return;

    setIsCapturing(true);

    try {
      // 1. Clone the SVG so we don't mess up the DOM
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      
      // 2. Set dimensions for the output image (High Res)
      const width = 1080;
      const height = 1080;
      clone.setAttribute("width", String(width));
      clone.setAttribute("height", String(height));
      clone.style.width = String(width);
      clone.style.height = String(height);

      // 3. IMPORTANT: Embed external images (textures) as Base64
      // Browsers won't export canvas with external cross-origin images unless they are embedded.
      const images = clone.querySelectorAll('image');
      await Promise.all(Array.from(images).map(async (img) => {
        const href = img.getAttribute('href') || img.getAttributeNS("http://www.w3.org/1999/xlink", "href");
        if (href && href.startsWith('http')) {
          try {
            const response = await fetch(href);
            const blob = await response.blob();
            return new Promise<void>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                img.setAttribute('href', reader.result as string);
                resolve();
              };
              reader.readAsDataURL(blob);
            });
          } catch (e) {
            console.warn("Failed to embed image:", href);
          }
        }
      }));

      // 4. Serialize to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clone);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      // 5. Draw to Canvas -> PNG
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // Draw white background first (SVGs are transparent)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Trigger Download
          const pngUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = `HWAN-Design-${work.label}-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          URL.revokeObjectURL(svgUrl);
          setIsCapturing(false);
        };
        img.src = svgUrl;
      } else {
        setIsCapturing(false);
      }

    } catch (e) {
      console.error("Screenshot failed", e);
      setIsCapturing(false);
      alert("截圖失敗，請稍後再試");
    }
  };

  return (
    <div className="w-full h-full bg-[#f8f9fa] relative overflow-hidden select-none">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2 bg-gray-50 z-10">
            <i className="fas fa-circle-notch fa-spin text-2xl text-[#E15A64]"></i>
            <span className="text-xs font-bold tracking-widest">LOADING WORK...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-400">
            <i className="fas fa-exclamation-triangle mr-2"></i> Failed to load SVG
          </div>
        )}
        
        {/* Canvas Wrapper / Viewport */}
        <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
           <div 
             ref={contentRef} 
             className="w-full h-full animate-fade-in"
           />
        </div>

        {/* Controls - Bottom Right */}
        {!loading && !error && (
          <div className="absolute bottom-6 right-6 flex flex-col gap-3 items-end z-20">
             {/* Download Button */}
             <button
              onClick={handleDownload}
              disabled={isCapturing}
              className="w-14 h-14 bg-[#E15A64] text-white rounded-full shadow-lg border-2 border-[#E15A64] flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              title="下載設計圖"
            >
               {isCapturing ? (
                 <i className="fas fa-spinner fa-spin"></i>
               ) : (
                 <i className="fas fa-camera"></i>
               )}
            </button>
          </div>
        )}
    </div>
  );
};