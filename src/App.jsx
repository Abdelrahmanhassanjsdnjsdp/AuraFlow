import React, { useState, useEffect, useRef } from 'react';
// import user-provided road image
import roadImg from './road-img.jpg';

// API base URL - uses VITE_API_URL env var or empty string (Vercel will serve from same origin)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
import { 
  MapPin, 
  Navigation, 
  Settings, 
  Gift, 
  Shield,
  X,
  CheckCircle,
  Loader,
  UploadCloud,
  LocateFixed,
  Phone,
  Activity,
  Search,
  ArrowRight,
  Wind,
  CornerUpRight,
  ArrowUp,
  Target,
  Siren,
  Compass,
  Gauge,
  Plus,
  Minus,
  TrendingUp,
  Award,
  Fuel,
  Camera,
  AlertTriangle,
  Construction,
  ImageIcon,
  Mic,
  Lightbulb,
  ChevronRight,
  Smartphone,
  MessageSquare
} from 'lucide-react';

// --- Assets & Icons ---
const BrandLogo = ({ name, color }) => (
  <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center text-[10px] font-bold text-white overflow-hidden shadow-md`}>
    {name.substring(0, 2).toUpperCase()}
  </div>
);

// --- Components ---

const NotificationToast = ({ message, type, visible, onClose }) => {
  if (!visible) return null;
  const isAlert = type === 'alert';
  const isSuccess = type === 'success';
  const isInfo = type === 'info';
  
  let bgColor = 'bg-slate-800/95 border-slate-700';
  let iconColor = 'bg-slate-700 text-white';
  let icon = <CheckCircle size={20} />;

  if (isAlert) {
    bgColor = 'bg-red-500/90 border-red-400';
    iconColor = 'bg-white/20 text-white';
    icon = <Siren size={20} className="animate-pulse" />;
  } else if (isSuccess) {
    bgColor = 'bg-green-500/90 border-green-400';
    iconColor = 'bg-white/20 text-white';
    icon = <Award size={20} className="animate-bounce" />;
  } else if (isInfo) {
    bgColor = 'bg-blue-600/90 border-blue-400';
    iconColor = 'bg-white/20 text-white';
    icon = <MessageSquare size={20} />;
  }

  return (
    <div className={`absolute top-24 left-4 right-4 z-[60] animate-in slide-in-from-top-5 duration-500`}>
      <div className={`${bgColor} backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl border flex items-start gap-4`}>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${iconColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm uppercase tracking-wider mb-1">{isAlert ? 'Traffic Alert' : (isSuccess ? 'Success' : 'New Message')}</h4>
          <p className="text-sm font-medium opacity-90 leading-tight">{message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// 1. Login / Splash Screen
const LoginScreen = ({ onLogin, onShowNotification }) => {
  const [step, setStep] = useState('initial'); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedCode, setGeneratedCode] = useState(''); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); 
    if (value.length <= 11) {
      setPhoneNumber(value);
      setError('');
    }
  };

  const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

  const handleSendCode = () => {
    setIsLoading(true);
    const egyptianRegex = /^01\d{9}$/;
    setTimeout(() => {
      if (egyptianRegex.test(phoneNumber)) {
        setIsLoading(false);
        const code = generateOTP();
        setGeneratedCode(code);
        setStep('otp');
        onShowNotification(`Your verification code is ${code}`, 'info');
      } else {
        setIsLoading(false);
        setError('Please enter a valid Egyptian number (01xxxxxxxxx)');
      }
    }, 1500);
  };

  const handleVerifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (otp === generatedCode) {
        setIsLoading(false);
        onLogin();
      } else {
        setIsLoading(false);
        setError('Invalid code. Please check SMS and try again.');
      }
    }, 1000);
  };

  const handleResendCode = () => {
    const code = generateOTP();
    setGeneratedCode(code);
    setOtp('');
    setError('');
    onShowNotification(`New code sent: ${code}`, 'info');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 items-center justify-between py-20 relative overflow-hidden text-white">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]"></div>
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
      </div>

      <div className="z-10 flex flex-col items-center gap-6 mt-10 w-full px-8">
        <div className="w-24 h-24 relative mb-4">
           <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
             <path d="M50 10 L90 90 L10 90 Z" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinejoin="round" />
             <path d="M50 25 L80 85 L20 85 Z" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinejoin="round" className="opacity-70" />
             <path d="M30 60 L70 60" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
           </svg>
        </div>
        
        {step === 'initial' && (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter mb-2">
              AuraFlow
            </h1>
            <p className="text-slate-400 text-sm tracking-wide">SMART TRAFFIC SYSTEM</p>
          </div>
        )}

        {step === 'phone' && (
          <div className="w-full animate-in slide-in-from-right duration-300">
             <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
             <p className="text-slate-400 text-sm mb-6">Enter your mobile number to continue.</p>
             
             <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3 mb-2 focus-within:border-cyan-500 transition-colors">
                <Smartphone className="text-slate-400" size={20} />
                <div className="w-px h-6 bg-slate-700"></div>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="01xxxxxxxxx"
                  className="bg-transparent border-none outline-none text-white text-lg w-full placeholder:text-slate-600 font-mono tracking-wide"
                  autoFocus
                />
             </div>
             {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
          </div>
        )}

        {step === 'otp' && (
          <div className="w-full animate-in slide-in-from-right duration-300">
             <h2 className="text-2xl font-bold mb-2">Verification</h2>
             <p className="text-slate-400 text-sm mb-6">Enter the 4-digit code sent to {phoneNumber}</p>
             
             <div className="flex gap-4 justify-center mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${otp[i] ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 bg-slate-800'}`}>
                    {otp[i] || ''}
                  </div>
                ))}
             </div>
             <input 
                type="tel"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0,4);
                  setOtp(val);
                  setError('');
                }}
                className="opacity-0 absolute inset-0 z-10 cursor-pointer h-1/2 top-1/4"
                autoFocus
             />
             {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}
             <div className="text-center">
               <p className="text-xs text-slate-500 mb-1">Didn't receive code?</p>
               <button onClick={handleResendCode} className="text-cyan-400 text-sm font-bold hover:text-cyan-300 transition-colors active:scale-95">Resend Code</button>
             </div>
          </div>
        )}
      </div>

      <div className="z-20 w-full px-8 mb-10 mt-auto">
        {step === 'initial' && (
          <button 
            onClick={() => setStep('phone')}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-cyan-900/20"
          >
            <Phone size={20} className="text-cyan-400" />
            <span>Login with Phone</span>
          </button>
        )}
        {step === 'phone' && (
          <button onClick={handleSendCode} disabled={phoneNumber.length !== 11 || isLoading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-cyan-900/20">
            {isLoading ? <Loader className="animate-spin" /> : <><span>Send Code</span><ArrowRight size={20} /></>}
          </button>
        )}
        {step === 'otp' && (
          <button onClick={handleVerifyOtp} disabled={otp.length !== 4 || isLoading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-cyan-900/20">
            {isLoading ? <Loader className="animate-spin" /> : <span>Verify & Login</span>}
          </button>
        )}
        {step !== 'initial' && (
          <button onClick={() => { if(step === 'otp') setStep('phone'); else setStep('initial'); setError(''); setOtp(''); }} className="w-full mt-4 py-2 text-slate-500 text-sm hover:text-white transition-colors">Back</button>
        )}
      </div>
    </div>
  );
};

// Calculate bearing between two points (in degrees: 0=up, 90=right, 180=down, 270=left)
function calculateBearing(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // atan2(y, x) gives angle, but we need bearing style (0° = north/up)
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  // Convert: atan2 gives -90(up) to 90(down), we want 0(up) to 360
  angle = (angle + 90 + 360) % 360;
  return angle;
}

// Determine turn type based on bearing change (only Right, Left, Straight - no U-turn)
function getTurnInstruction(fromBearing, toBearing) {
  let diff = (toBearing - fromBearing + 360) % 360;
  // Normalize to -180 to 180 for easier comparison
  if (diff > 180) diff = diff - 360;
  
  // -45 to 45: straight
  if (Math.abs(diff) <= 45) {
    return { text: 'Go Straight', icon: 'ArrowUp' };
  } 
  // 45 to 135: right turn
  else if (diff > 45) {
    return { text: 'Turn Right', icon: 'CornerUpRight' };
  } 
  // -135 to -45: left turn
  else {
    return { text: 'Turn Left', icon: 'CornerUpLeft' };
  }
}

// Generate instruction for current route segment based on actual geometry
function generateRouteInstruction(route, currentIndex, roadNodes) {
  if (!route || route.length < 2) {
    return { text: 'Continue', icon: 'ArrowRight' };
  }
  
  // If at first road, show direction to next
  if (currentIndex === 0 && route.length > 1) {
    const from = roadNodes[route[0]];
    const to = roadNodes[route[1]];
    if (from && to) {
      const bearing = calculateBearing(from, to);
      return getTurnInstruction(0, bearing); // assume facing north initially
    }
  }
  
  // If at intermediate roads, compare previous→current→next bearings
  if (currentIndex > 0 && currentIndex < route.length - 1) {
    const prev = roadNodes[route[currentIndex - 1]];
    const curr = roadNodes[route[currentIndex]];
    const next = roadNodes[route[currentIndex + 1]];
    
    if (prev && curr && next) {
      const inBearing = calculateBearing(prev, curr);
      const outBearing = calculateBearing(curr, next);
      return getTurnInstruction(inBearing, outBearing);
    }
  }
  
  // At last road
  return { text: 'Arrive', icon: 'CheckCircle' };
}

// Turn instruction generator based on route progression
function generateTurnInstructions(routeIndex, maxIndex) {
  const instructions = [
    { text: 'Turn Right', icon: 'CornerUpRight', distance: '200m' },
    { text: 'Turn Left', icon: 'CornerUpLeft', distance: '150m' },
    { text: 'Go Straight', icon: 'ArrowUp', distance: '250m' },
    { text: 'Continue', icon: 'ArrowRight', distance: '300m' },
    { text: 'Make U-turn', icon: 'RotateCcw', distance: '180m' }
  ];
  const index = routeIndex % instructions.length;
  return instructions[index];
}

// Road nodes positions (x,y in the 800x800 image space) and simple graph
const ROAD_NODES = {
   1: { x: 740, y: 400 },
   2: { x: 740, y: 120 },
   3: { x: 480, y: 120 },
   4: { x: 400, y: 40 },
   5: { x: 240, y: 120 },
   6: { x: 240, y: 40 },
   7: { x: 520, y: 400 },
   8: { x: 320, y: 400 },
   9: { x: 80, y: 400 },
   10: { x: 740, y: 600 },
   11: { x: 400, y: 520 },
   12: { x: 240, y: 600 },
   13: { x: 480, y: 680 },
   14: { x: 200, y: 680 }
};

// Simple adjacency graph that maps roads to connected roads.
// Designed so that shortest path from 1 to 12 goes: 1 -> 7 -> 8 -> 12 (as example)
const ROAD_GRAPH = {
   1: [7],
   2: [3,4],
   3: [2,4,5],
   4: [3,5,7],
   5: [3,4,6],
   6: [5],
   7: [1,8,11,4],
   8: [7,9,11,12],
   9: [8],
   10: [11],
   11: [7,8,10,13,4],
   12: [8,14],
   13: [11,14],
   14: [12,13]
};

function findShortestPath(start, target) {
   if (start === target) return [start];
   const q = [start];
   const visited = new Set([start]);
   const prev = {};
   while (q.length) {
      const node = q.shift();
      const neighbors = ROAD_GRAPH[node] || [];
      for (const n of neighbors) {
         if (visited.has(n)) continue;
         visited.add(n);
         prev[n] = node;
         if (n === target) {
            // build path
            const path = [n];
            let cur = n;
            while (cur !== start) {
               cur = prev[cur];
               path.push(cur);
            }
            return path.reverse();
         }
         q.push(n);
      }
   }
   return null;
}

// --- PROJECT IMAGE MAP COMPONENT (Updated to use project image) ---
const ProjectImageMap = ({ zoom = 1, showRoute = false, nodes = ROAD_NODES, route = [] }) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out origin-center bg-slate-900`}
      style={{ transform: `scale(${zoom})` }}
    >
      {/* Project road layout board - Replace this src with your actual image path */}
         <img 
            src={roadImg}
            alt="AuraFlow Road Numbered Layout"
            className="w-full h-full object-contain"
            style={{ pointerEvents: 'none' }}
            onError={(e) => { e.target.style.display = 'none'; }}
         />
      
      {/* Fallback SVG representation of the road layout */}
      <svg 
        className="w-full h-full object-contain"
        viewBox="0 0 800 800"
        style={{ pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="800" height="800" fill="#ffffff"/>
        
        {/* Central Roundabout */}
        <circle cx="400" cy="400" r="60" fill="#ffffff" stroke="#1e293b" strokeWidth="2"/>
        <circle cx="400" cy="400" r="50" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4"/>
        
        {/* Main Vertical Road */}
        <rect x="390" y="0" width="20" height="800" fill="#475569"/>
        <line x1="400" y1="0" x2="400" y2="340" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 4"/>
        <line x1="400" y1="460" x2="400" y2="800" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 4"/>
        
        {/* Main Horizontal Road */}
        <rect x="0" y="390" width="800" height="20" fill="#475569"/>
        <line x1="0" y1="400" x2="340" y2="400" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 4"/>
        <line x1="460" y1="400" x2="800" y2="400" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 4"/>
        
        {/* Secondary Horizontal Roads */}
        <rect x="0" y="190" width="800" height="15" fill="#475569"/>
        <line x1="0" y1="197.5" x2="800" y2="197.5" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 3"/>
        
        <rect x="0" y="595" width="800" height="15" fill="#475569"/>
        <line x1="0" y1="602.5" x2="800" y2="602.5" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 3"/>
        
        {/* Secondary Vertical Roads */}
        <rect x="190" y="0" width="15" height="800" fill="#475569"/>
        <line x1="197.5" y1="0" x2="197.5" y2="800" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 3"/>
        
        <rect x="595" y="0" width="15" height="800" fill="#475569"/>
        <line x1="602.5" y1="0" x2="602.5" y2="800" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 3"/>
        
        {/* Intersection markings */}
        <circle cx="197.5" cy="197.5" r="8" fill="#ffffff"/>
        <circle cx="602.5" cy="197.5" r="8" fill="#ffffff"/>
        <circle cx="197.5" cy="602.5" r="8" fill="#ffffff"/>
        <circle cx="602.5" cy="602.5" r="8" fill="#ffffff"/>
      </svg>
      
      {/* Dark overlay to ensure UI readability */}
      <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>

         {/* Number overlay removed: numbers baked into image will be used instead.
               Node coordinates remain defined in ROAD_NODES for routing calculations,
               but no visual markers are rendered here to avoid duplicate/random numbers. */}
    </div>
  );
};

// 2. Dashboard Screen
const DashboardScreen = ({ onStartRoute }) => {
   const [viewState, setViewState] = useState('dashboard');
   const [currentLocation, setCurrentLocation] = useState('Road 1');
   const [destination, setDestination] = useState('');
   const [destinationNumber, setDestinationNumber] = useState(null);
   const [routeSteps, setRouteSteps] = useState([]);
   const [isLocating, setIsLocating] = useState(false);
   const [congestedRoads, setCongestedRoads] = useState([]);
   const [lastStateVersion, setLastStateVersion] = useState(0);

   // Poll for congestion state updates
   useEffect(() => {
     const pollInterval = setInterval(async () => {
       try {
const response = await fetch(`/api/state`);
         if (!response.ok) {
           console.warn('Polling: Backend returned status', response.status);
           return;
         }
         
         // Check if response is actually JSON before parsing
         const contentType = response.headers.get('content-type');
         if (!contentType || !contentType.includes('application/json')) {
           console.warn('Polling: Response is not JSON, backend may be unavailable');
           return;
         }
         
         const { congested, version } = await response.json();
         
         // Only update if version changed
         if (version > lastStateVersion) {
           setCongestedRoads(congested);
           setLastStateVersion(version);
         }
       } catch (error) {
         // Silently log errors - backend may be down or not accessible yet
         // This is expected during development when backend is not running
         console.debug('Polling error (expected if backend is down):', error.message);
       }
     }, 5000); // Poll every 5 seconds
     
     return () => clearInterval(pollInterval);
   }, [lastStateVersion]);
   const [zoom, setZoom] = useState(1); 

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocation("GPS Unavailable");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation(`Lat: ${latitude.toFixed(3)}, Lon: ${longitude.toFixed(3)}`);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setCurrentLocation("Location Unknown"); 
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => { detectLiveLocation(); }, []);

   const handleSearch = async () => {
    // always start from Road 1
    const start = 1;
    let target = null;
    if (!destination && !destinationNumber) return;
    if (destinationNumber) target = Number(destinationNumber);
    else {
      const m = (destination || '').match(/\d+/);
      if (m) target = Number(m[0]);
    }
    if (!target || !ROAD_NODES[target]) {
      alert('Please enter a valid road number between 1 and 14');
      return;
    }
    
    setViewState('searching');
    
    try {
      // Build URL with congested roads as avoid parameter
      let url = `${API_BASE_URL}/api/route?from=${start}&to=${target}`;
      if (congestedRoads && congestedRoads.length > 0) {
        url += `&avoid=${congestedRoads.join(',')}`;
      }
      
      console.log('Route request:', url);
      console.log('Congested roads:', congestedRoads);
      
      // Call backend API for route calculation
      const response = await fetch(url);
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      const isJSON = contentType && contentType.includes('application/json');
      
      if (!response.ok) {
        if (isJSON) {
          const errorData = await response.json();
          console.error('Route error response:', response.status, errorData);
          
          // Handle different error types
          if (response.status === 400) {
            alert(`Invalid input: ${errorData.error}`);
          } else if (response.status === 404) {
            alert(`No available route found.\nCongested roads: ${congestedRoads.length > 0 ? congestedRoads.join(', ') : 'none'}\n\nTry again when roads are clear.`);
          } else {
            alert(`Route error: ${errorData.error}`);
          }
        } else {
          console.error('Route error response:', response.status, 'Non-JSON response');
          alert(`Backend not responding correctly (Status: ${response.status}).\n\nPlease make sure the backend server is running.\n\nRun "vercel dev" in another terminal.`);
        }
        setViewState('search');
        return;
      }
      
      if (!isJSON) {
        console.error('Backend returned non-JSON response');
        alert('Backend is not responding correctly.\n\nPlease make sure the backend server is running.\n\nRun "vercel dev" in another terminal.');
        setViewState('search');
        return;
      }
      
      const data = await response.json();
      const path = data.path || [];
      
      if (!path || path.length === 0) {
        alert('No valid path could be calculated. Please try different roads.');
        setViewState('search');
        return;
      }
      
      setRouteSteps(path);
      setDestinationNumber(target);
      setViewState('smart-route');
      setZoom(1.0);
    } catch (error) {
      console.error('Route search error:', error);
      alert(`Backend Error:\n\n${error.message}\n\nPlease make sure:\n1. Backend is running ("vercel dev")\n2. API endpoint is accessible\n3. Check your internet connection`);
      setViewState('search');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
         <ProjectImageMap zoom={zoom} showRoute={false} nodes={ROAD_NODES} route={routeSteps} />
         <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/80 pointer-events-none"></div>
      </div>

      <div className="relative z-10 pt-12 px-6 flex justify-between items-start pointer-events-none">
         <div className="bg-slate-800/80 backdrop-blur-md border border-green-500/30 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg pointer-events-auto">
            <Wind size={14} className="text-green-400" />
            <span className="text-xs font-bold text-slate-200">Zone AQI 45</span>
         </div>
         <button className="h-10 w-10 bg-slate-800/80 backdrop-blur rounded-full flex items-center justify-center border border-slate-700 pointer-events-auto">
            <Settings size={18} className="text-slate-300" />
         </button>
      </div>
      
      <div className="absolute top-32 right-4 z-20 flex flex-col gap-3">
         <button onClick={handleZoomIn} className="h-10 w-10 bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center border border-slate-700 text-white shadow-lg active:scale-95 transition-all">
            <Plus size={20} />
         </button>
         <button onClick={handleZoomOut} className="h-10 w-10 bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center border border-slate-700 text-white shadow-lg active:scale-95 transition-all">
            <Minus size={20} />
         </button>
      </div>

      <div className="flex-1 relative z-10 flex flex-col justify-end pb-24 px-4 pointer-events-none">
         {viewState === 'dashboard' && (
           <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-5 shadow-2xl mb-4 pointer-events-auto">
              <h3 className="text-lg font-bold text-white mb-4">Plan Trip</h3>
                         <div onClick={() => setViewState('input')} className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700 cursor-pointer">
                 <Search size={18} className="text-cyan-400" />
                 <span className="text-sm text-slate-400">Enter Road Number...</span>
              </div>
           </div>
         )}

         {viewState === 'input' && (
            <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 rounded-t-[2.5rem] p-6 shadow-2xl -mx-4 animate-in slide-in-from-bottom-20 h-[60%] flex flex-col pointer-events-auto">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Select Roads</h3>
                  <button onClick={() => setViewState('dashboard')} className="p-2 bg-slate-800 rounded-full text-slate-400"><X size={18} /></button>
               </div>
               
               <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                     <div className="flex flex-col items-center gap-1">
                        <div className="h-3 w-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                        <div className="w-0.5 h-8 bg-slate-700"></div>
                     </div>
                     <div className="flex-1 flex items-center gap-2 bg-slate-800 p-4 rounded-2xl border border-slate-700 opacity-80 cursor-not-allowed">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                             <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">GPS Locked</p>
                             {isLocating && <Loader size={10} className="animate-spin text-blue-400" />}
                          </div>
                          <p className="text-sm font-bold text-white truncate">{currentLocation}</p>
                        </div>
                        <LocateFixed size={18} className="text-blue-500" />
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="h-3 w-3 bg-cyan-500 rounded-sm shadow-[0_0_10px_#06b6d4]"></div>
                     <div className="flex-1 bg-slate-800 p-4 rounded-2xl border border-cyan-500/50 focus-within:border-cyan-400 transition-colors">
                        <p className="text-xs text-slate-500 mb-1">Destination Road (1-14)</p>
                        <div className="flex items-center gap-2">
                          <input 
                             autoFocus
                             type="number"
                             min={1}
                             max={14}
                             className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-slate-600"
                             placeholder="Enter number (e.g. 12)"
                             value={destinationNumber || ''}
                             onChange={(e) => { setDestinationNumber(e.target.value ? Number(e.target.value) : null); setDestination(''); }}
                          />
                          <button onClick={() => { setDestinationNumber(null); setDestination(''); }} className="text-xs text-slate-400">Clear</button>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">Starting point is Road 1</p>
                     </div>
                  </div>
               </div>

               <button 
                  onClick={handleSearch}
                  disabled={!destinationNumber && !destination}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                  Find Optimized Route <ArrowRight size={18} />
               </button>
            </div>
         )}

         {viewState === 'searching' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 pointer-events-auto">
               <div className="flex flex-col items-center gap-4">
                  <Activity className="text-cyan-500 animate-spin" size={48} />
                  <span className="text-cyan-400 font-bold tracking-widest text-sm animate-pulse">CALCULATING ROUTE...</span>
               </div>
            </div>
         )}

             {viewState === 'smart-route' && (
                <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 rounded-t-[2.5rem] p-6 shadow-2xl -mx-4 animate-in slide-in-from-bottom-20 z-10 pointer-events-auto">
                   <div className="mb-3">
                        <h2 className="text-lg font-bold text-white mb-1">Route Confirmed</h2>
                        <p className="text-sm text-slate-400">Path to Road {destinationNumber} ready</p>
                   </div>
                   <div className="mb-4 space-y-2">
                      <p className="text-xs text-slate-400 uppercase">Guidance Steps</p>
                      {routeSteps && routeSteps.length > 0 ? (
                         <ol className="list-decimal list-inside text-sm text-white">
                            {routeSteps.map((r, i) => (
                               <li key={i} className={`${i === 0 ? 'font-bold text-amber-300' : ''}`}>Road {r}{i === routeSteps.length - 1 ? ' (Destination)' : ''}</li>
                            ))}
                         </ol>
                      ) : (
                         <p className="text-sm text-red-400">No path found.</p>
                      )}
                   </div>
                   <button 
                      onClick={() => onStartRoute(routeSteps)}
                      className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:to-blue-500 rounded-full font-bold text-white shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm tracking-wider"
                   >
                      START DRIVING
                   </button>
                </div>
             )}
      </div>
    </div>
  );
};

// 3. Navigation Screen
const NavigationScreen = ({ onEndDrive, route = [] }) => {
   const [telemetry, setTelemetry] = useState({ speed: 45, heading: 'NE', alt: 24, accuracy: 4 });
   const [progress, setProgress] = useState(0);
   const [zoom, setZoom] = useState(1.2); 
   const [tripPoints, setTripPoints] = useState(0);
   const [isAdhering, setIsAdhering] = useState(true);
   const [currentStepIndex, setCurrentStepIndex] = useState(0);
   const [currentInstruction, setCurrentInstruction] = useState(generateRouteInstruction(route, 0, ROAD_NODES));

   const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
   const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

   useEffect(() => {
     const interval = setInterval(() => {
       setTelemetry(prev => ({
         speed: Math.min(80, Math.max(30, prev.speed + (Math.random() * 10 - 5))).toFixed(0),
         heading: prev.heading,
         alt: prev.alt,
         accuracy: (Math.random() * 2 + 3).toFixed(1)
       }));
       setProgress(p => Math.min(100, p + 0.5));
       if (isAdhering) {
         setTripPoints(p => p + 5); 
       }
     }, 1000);
     return () => clearInterval(interval);
   }, [isAdhering]);

   // cycle through route steps and update instruction based on actual geometry
   useEffect(() => {
     const instructionInterval = setInterval(() => {
       setCurrentStepIndex(prev => {
         const next = (prev + 1) % Math.max(route.length, 1);
         const inst = generateRouteInstruction(route, next, ROAD_NODES);
         setCurrentInstruction(inst);
         return next;
       });
     }, 8000);
     return () => clearInterval(instructionInterval);
   }, [route]);

   const handleEndNavigation = () => {
     onEndDrive(tripPoints);
   };

   return (
     <div className="h-full bg-slate-900 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 z-0 overflow-hidden">
             <ProjectImageMap zoom={zoom} showRoute={false} mode="2d" />
             <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-transparent pointer-events-none"></div>
        </div>

        <div className="absolute top-44 right-4 z-20 flex flex-col gap-3">
           <button onClick={handleZoomIn} className="h-10 w-10 bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center border border-slate-700 text-white shadow-lg active:scale-95 transition-all">
              <Plus size={20} />
           </button>
           <button onClick={handleZoomOut} className="h-10 w-10 bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center border border-slate-700 text-white shadow-lg active:scale-95 transition-all">
              <Minus size={20} />
           </button>
        </div>

        <div className="relative z-10 pt-12 px-4 space-y-2">
           <div className="bg-black/80 backdrop-blur-md border border-slate-700 rounded-xl p-3 flex justify-between items-center shadow-lg">
              <div className="flex flex-col items-center w-1/4 border-r border-slate-700">
                 <span className="text-[10px] text-slate-400 uppercase tracking-widest">Speed</span>
                 <span className="text-xl font-black text-white">{telemetry.speed} <span className="text-[10px] font-normal text-slate-500">km/h</span></span>
              </div>
              <div className="flex flex-col items-center w-1/4 border-r border-slate-700">
                 <span className="text-[10px] text-slate-400 uppercase tracking-widest">Heading</span>
                 <div className="flex items-center gap-1 text-cyan-400">
                    <Compass size={12} />
                    <span className="text-lg font-bold">{telemetry.heading}</span>
                 </div>
              </div>
              <div className="flex flex-col items-center w-1/4 border-r border-slate-700">
                 <span className="text-[10px] text-slate-400 uppercase tracking-widest">Alt</span>
                 <span className="text-lg font-bold text-white">{telemetry.alt}m</span>
              </div>
              <div className="flex flex-col items-center w-1/4">
                 <span className="text-[10px] text-slate-400 uppercase tracking-widest">GPS</span>
                 <div className="flex items-center gap-1 text-green-400">
                    <Target size={12} />
                    <span className="text-lg font-bold">±{telemetry.accuracy}m</span>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 backdrop-blur-md border border-amber-500/50 rounded-xl p-3 flex justify-between items-center shadow-lg animate-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                 <div className="bg-amber-500 p-1.5 rounded-full animate-pulse">
                    <TrendingUp size={16} className="text-black" />
                 </div>
                 <div>
                    <p className="text-[10px] text-amber-200 uppercase font-bold tracking-widest">Trip Earnings</p>
                    <p className="text-lg font-black text-white leading-none">+{tripPoints} Pts</p>
                 </div>
              </div>
              <div className="text-right">
                 <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded font-bold">Active Trip</span>
              </div>
           </div>
        </div>

        {/* Guidance steps for driver (derived from route) */}
        <div className="absolute top-28 left-4 z-30 pointer-events-auto">
           <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-3 shadow-lg">
              <p className="text-xs text-slate-400 uppercase font-bold">Route Guidance</p>
              {route && route.length > 0 ? (
                <ol className="list-decimal list-inside text-white text-sm mt-2">
                  {route.map((r, i) => (
                    <li key={i} className={`${i === 0 ? 'font-bold text-amber-300' : ''}`}>Road {r}{i === route.length - 1 ? ' (Destination)' : ''}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-400 mt-2">No route available</p>
              )}
           </div>
        </div>

        <div className="mt-auto mb-24 mx-4 bg-slate-900/95 backdrop-blur-xl p-5 rounded-3xl border border-slate-700 shadow-2xl animate-in slide-in-from-bottom-5">
           <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-600 h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_#2563eb]">
                 {currentInstruction.icon === 'CornerUpRight' && <CornerUpRight size={24} />}
                 {currentInstruction.icon === 'CornerUpLeft' && <div className="text-xl">↖️</div>}
                 {currentInstruction.icon === 'ArrowUp' && <ArrowUp size={24} />}
                 {currentInstruction.icon === 'ArrowRight' && <ArrowRight size={24} />}
                 {currentInstruction.icon === 'RotateCcw' && <div className="text-xl">↩️</div>}
              </div>
              <div>
                 <h2 className="text-lg font-bold text-white">{currentInstruction.text}</h2>
                 <p className="text-blue-200 text-sm">Road {route && route[currentStepIndex] ? route[currentStepIndex] : '...'}</p>
              </div>
           </div>
           
           <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
              <div className="bg-cyan-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
           </div>

           <button onClick={handleEndNavigation} className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold border border-red-500/30 hover:bg-red-500/20 transition-colors">
              End Navigation
           </button>
        </div>
     </div>
   );
};

// 4. Points Screen (With Refuel Section)
const PointsScreen = ({ sessionPoints = 0 }) => {
  const [totalPoints, setTotalPoints] = useState(2450);
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    if (sessionPoints > 0) {
      setTotalPoints(prev => prev + sessionPoints);
    }
  }, [sessionPoints]);

  const vouchers = [
    { id: 1, name: "Shell", points: 500, color: "bg-red-600" },
    { id: 2, name: "Chillout", points: 450, color: "bg-blue-600" },
    { id: 3, name: "Wataniya", points: 400, color: "bg-green-600" },
    { id: 4, name: "Total", points: 500, color: "bg-orange-500" },
  ];

  const handleRedeem = (id, points) => {
    if (totalPoints < points) return;
    setRedeeming(id);
    setTimeout(() => {
      setTotalPoints(prev => prev - points);
      setRedeeming(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-y-auto pb-24">
      <div className="pt-12 px-6 pb-2">
         <h1 className="text-xl font-bold">Aura Points</h1>
      </div>
      <div className="p-6 space-y-6">
         {/* Balance Card */}
         <div className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 rounded-[2rem] p-6 text-slate-900 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
               <span className="text-sm font-bold opacity-70">Total Balance</span>
               <h2 className="text-4xl font-extrabold mt-1 mb-6">{totalPoints.toLocaleString()}</h2>
               
               {sessionPoints > 0 && (
                 <div className="mb-4 bg-white/30 backdrop-blur p-2 rounded-lg text-xs font-bold flex items-center gap-2">
                    <TrendingUp size={14} /> +{sessionPoints} pts from recent trip
                 </div>
               )}

               <div className="flex justify-between text-xs font-bold opacity-80">
                  <span>Standard</span>
                  <span>Gold Member</span>
               </div>
            </div>
         </div>

         {/* Refuel Section */}
         <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="bg-slate-800 p-2 rounded-lg">
                  <Fuel size={20} className="text-amber-400" />
               </div>
               <h3 className="text-lg font-bold text-white">Redeem Fuel</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {vouchers.map((v) => (
                  <button 
                    key={v.id}
                    disabled={totalPoints < v.points || redeeming !== null}
                    onClick={() => handleRedeem(v.id, v.points)}
                    className={`bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-3 transition-all ${totalPoints >= v.points ? 'hover:border-amber-500/50 active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
                  >
                     <div className="relative">
                        <BrandLogo name={v.name} color={v.color} />
                        {redeeming === v.id && (
                           <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                              <Loader size={12} className="text-white animate-spin" />
                           </div>
                        )}
                     </div>
                     <div className="text-center">
                        <p className="font-bold text-sm text-slate-200">{v.name}</p>
                        <p className="text-xs text-amber-400 font-bold">{v.points} Pts</p>
                     </div>
                  </button>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

// 5. Watch Screen (Revised to Match Image + Photo Upload)
const WatchScreen = ({ onReport }) => {
   const [step, setStep] = useState('select'); // select, record, processing, done, camera
   const [isRecording, setIsRecording] = useState(false);

   const startRecording = () => {
      setIsRecording(true);
      setTimeout(() => {
         setIsRecording(false);
         setStep('processing');
         setTimeout(() => {
            setStep('done');
            onReport();
            setTimeout(() => {
               setStep('select');
            }, 2500);
         }, 1500);
      }, 3000);
   };

   // Mock Photo Upload Handler
   const handlePhotoUpload = () => {
      setStep('processing');
      setTimeout(() => {
         setStep('done');
         onReport();
         setTimeout(() => {
            setStep('select');
         }, 2500);
      }, 1500);
   };

   return (
      <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden relative">
         <div className="pt-12 px-6 mb-4 flex items-center gap-2">
            <Shield className="text-cyan-400" />
            <h1 className="text-xl font-bold">Community Watch</h1>
         </div>

         <div className="flex-1 px-6 pb-24 flex flex-col">
            
            {/* Main Central Interaction Area */}
            {step === 'select' && (
               <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                  {/* Large Ripple Circle */}
                  <div className="relative mb-8">
                     <div className="absolute inset-0 rounded-full border border-cyan-500/10 scale-[1.8]"></div>
                     <div className="absolute inset-0 rounded-full border border-cyan-500/20 scale-[1.4]"></div>
                     
                     <div className="h-48 w-48 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center relative shadow-2xl">
                        <Mic size={64} className="text-cyan-400" />
                        
                        {/* Camera Icon - Small & Integrated */}
                        <button 
                           onClick={() => setStep('camera')}
                           className="absolute top-4 right-4 bg-slate-700 p-2 rounded-full border border-slate-600 hover:bg-slate-600 transition-colors"
                        >
                           <Camera size={16} className="text-white" />
                        </button>
                     </div>

                     {/* Report Hazard Pill Button */}
                     <button 
                        onClick={startRecording}
                        className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-orange-900/50 whitespace-nowrap active:scale-95 transition-transform z-10"
                     >
                        Report Hazard
                     </button>
                  </div>

                  {/* Hazard Type Grid */}
                  <div className="grid grid-cols-3 gap-3 w-full mt-8">
                     {[
                        { label: 'Pothole', icon: <Target size={20} /> },
                        { label: 'Broken Light', icon: <Lightbulb size={20} /> },
                        { label: 'Debris', icon: <Shield size={20} /> },
                     ].map((item, i) => (
                        <button key={i} className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-750 active:scale-95 transition-all">
                           <div className="text-slate-400">{item.icon}</div>
                           <span className="text-[10px] font-bold text-slate-300">{item.label}</span>
                        </button>
                     ))}
                  </div>

                  {/* Recent Reports */}
                  <div className="w-full mt-6">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Reports</span>
                        <Settings size={14} className="text-slate-500" />
                     </div>
                     <div className="space-y-2">
                        <div className="bg-slate-800/50 p-3 rounded-xl flex items-center justify-between border border-slate-700/50">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                 <Mic size={14} />
                              </div>
                              <span className="text-sm text-slate-300">Recent Hazard</span>
                           </div>
                           <button className="text-slate-500"><X size={14}/></button>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-xl flex items-center justify-between border border-slate-700/50">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                 <Mic size={14} />
                              </div>
                              <span className="text-sm text-slate-300">Recent Reports</span>
                           </div>
                           <button className="text-slate-500"><X size={14}/></button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Recording State */}
            {step === 'record' && ( /* ... simplified record UI just in case ... */ null )} 
            
            {/* Camera State */}
            {step === 'camera' && (
               <div className="flex-1 flex flex-col">
                  <div className="flex-1 bg-black rounded-3xl border-2 border-slate-700 relative overflow-hidden mb-6 mt-4">
                     <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-slate-600 text-xs">Camera Feed Active</p>
                     </div>
                     <div className="absolute inset-8 border-2 border-white/20 rounded-lg pointer-events-none"></div>
                  </div>
                  <div className="flex justify-center items-center gap-6 mb-8">
                     <button onClick={handlePhotoUpload} className="p-3 rounded-full bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700">
                        <ImageIcon size={24} />
                     </button>
                     <button onClick={handlePhotoUpload} className="p-5 rounded-full bg-white text-black border-4 border-slate-800 ring-2 ring-white active:scale-95">
                        <Camera size={32} />
                     </button>
                     <button onClick={() => setStep('select')} className="p-3 rounded-full bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700">
                        <X size={24} />
                     </button>
                  </div>
               </div>
            )}

            {/* Processing/Done States */}
            {(step === 'processing' || step === 'done') && (
               <div className="flex-1 flex flex-col items-center justify-center">
                  {step === 'processing' ? (
                     <>
                        <Loader size={48} className="text-cyan-400 animate-spin mb-4" />
                        <h3 className="text-lg font-bold">Processing...</h3>
                     </>
                  ) : (
                     <>
                        <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                           <CheckCircle size={40} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Report Sent!</h3>
                        <span className="text-amber-400 font-bold mt-2">+50 Points Earned</span>
                     </>
                  )}
               </div>
            )}
         </div>
      </div>
   );
};

// --- Main App Component ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'info' });
   const [currentRoute, setCurrentRoute] = useState([]);
  
  // Store session points to pass to PointsScreen
  const [lastSessionPoints, setLastSessionPoints] = useState(0);

  const handleLogin = () => setCurrentScreen('dashboard');
  const handleShowNotification = (msg, type) => triggerNotification(msg, type);

  const triggerNotification = (msg, type = 'info') => {
    setNotification({ visible: true, message: msg, type });
    setTimeout(() => { setNotification({ visible: false, message: '', type: 'info' }); }, 4000);
  };

  const handleReportAccident = () => {
    triggerNotification("Accident Reported! Location Verified.", 'alert');
  };

  const handleEndDrive = (earnedPoints) => {
    setLastSessionPoints(earnedPoints);
    setCurrentScreen('points');
    triggerNotification(`Trip Ended! You earned ${earnedPoints} Points.`, 'success');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 p-4 font-sans selection:bg-cyan-500/30">
      <div className="relative w-full max-w-sm h-[800px] bg-black rounded-[3.5rem] shadow-[0_0_60px_rgba(6,182,212,0.15)] border-[8px] border-slate-800 overflow-hidden ring-1 ring-slate-700/50">
        
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-center gap-2 px-3">
           <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
           <div className="w-12 h-1.5 rounded-full bg-slate-900"></div>
        </div>

        <NotificationToast 
          visible={notification.visible}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, visible: false })}
        />

        <div className="h-full w-full bg-slate-900">
          {currentScreen === 'splash' && (
            <LoginScreen 
              onLogin={handleLogin} 
              onShowNotification={handleShowNotification} 
            />
          )}
          {currentScreen === 'dashboard' && <DashboardScreen onStartRoute={(route) => { setCurrentRoute(route || []); setCurrentScreen('navigation'); }} />}
          
          {/* Pass the end drive handler to Navigation */}
          {currentScreen === 'navigation' && <NavigationScreen onEndDrive={handleEndDrive} route={currentRoute} />}
          
          {/* Pass the earned points to Points Screen */}
          {currentScreen === 'points' && <PointsScreen sessionPoints={lastSessionPoints} />}
          
          {/* Updated Reporting Screens - Only Community Watch now as Microbus is removed */}
          {currentScreen === 'watch' && (
             <WatchScreen 
               onReport={handleReportAccident} 
             />
          )}
        </div>

        {currentScreen !== 'splash' && currentScreen !== 'navigation' && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent flex justify-around items-end pb-8 px-2 z-40">
            <button onClick={() => setCurrentScreen('dashboard')} className={`flex flex-col items-center gap-1.5 w-16 transition-all ${currentScreen === 'dashboard' ? 'text-cyan-400 -translate-y-2' : 'text-slate-500'}`}>
              <div className={`p-2 rounded-2xl ${currentScreen === 'dashboard' ? 'bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : ''}`}><Navigation size={24} /></div>
            </button>
            <button onClick={() => setCurrentScreen('points')} className={`flex flex-col items-center gap-1.5 w-16 transition-all ${currentScreen === 'points' ? 'text-amber-400 -translate-y-2' : 'text-slate-500'}`}>
               <div className={`p-2 rounded-2xl ${currentScreen === 'points' ? 'bg-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : ''}`}><Gift size={24} /></div>
            </button>
            <button onClick={() => setCurrentScreen('watch')} className={`flex flex-col items-center gap-1.5 w-16 transition-all ${currentScreen === 'watch' ? 'text-red-400 -translate-y-2' : 'text-slate-500'}`}>
               <div className={`p-2 rounded-2xl ${currentScreen === 'watch' ? 'bg-red-500/20 shadow-[0_0_15px_rgba(248,113,113,0.3)]' : ''}`}><Shield size={24} /></div>
            </button>
          </div>
        )}

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-slate-100/20 rounded-full z-50"></div>
      </div>
    </div>
  );
}




