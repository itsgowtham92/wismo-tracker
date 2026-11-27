import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from './supabaseClient';

const POPULAR_COURIERS = [
  { name: 'ST Courier', code: 'STCOURIER' },
  { name: 'DTDC', code: 'DTDC' },
  { name: 'Franch Express', code: 'Franch Express' },
  { name: 'The Professional Couriers', code: 'PROFESSIONAL' },
  { name: 'Delhivery', code: 'DELHIVERY' },
  { name: 'Xpressbees', code: 'XPRESSBEES' },
  { name: 'Blue Dart', code: 'BLUEDART' },
  { name: 'India Post', code: 'INDIA POST' },
  { name: 'Speed Post', code: 'Speed Post' },
  { name: 'Ekart', code: 'EKART' },
  { name: 'Shadowfax', code: 'SHADOWFAX' },
  { name: 'Trackon', code: 'TRACKON' },
  { name: 'Shree Maruti Courier', code: 'SHREE MARUTI COURIER' },
  { name: 'Shree Tirupati Courier', code: 'SHREE TIRUPATI COURIER' },
  { name: 'AKR Express', code: 'AKR Express' },
  { name: 'KPN', code: 'KPN' },
  { name: 'ABT Parcel Services', code: 'abt parcel services' },
  { name: 'Valmo', code: 'Valmo' },
];

const OTHER_COURIERS = [
  { name: 'ACPL', code: 'Acpl' },
  { name: 'Air India', code: 'AIRINDIA' },
  { name: 'Akasa', code: 'AKASA' },
  { name: 'Alleppey Parcel Service LLP', code: 'ALLEPPEY PARCEL SERVICE LLP' },
  { name: 'Amazon Tracking Services', code: 'AMAZON TRACKING SERVICES' },
  { name: 'Aramex', code: 'ARAMEX' },
  { name: 'ARC Limited', code: 'ARC Limited' },
  { name: 'Atlantic Courier', code: 'ATLANTIC Courier' },
  { name: 'Australian Post', code: 'Australian Post' },
  { name: 'AWCC', code: 'AWCC' },
  { name: 'BlitzNow', code: 'BLITZNOW' },
  { name: 'Bombino', code: 'BOMBINO' },
  { name: 'Bulllettrans', code: 'Bulllettrans' },
  { name: 'ClickPost', code: 'CLICKPOST' },
  { name: 'CouriersPlease', code: 'COURIERSPLEASE' },
  { name: 'CPS Logistics', code: 'cps logistics' },
  { name: 'Delhivery B2B', code: 'DELHIVERYB2B' },
  { name: 'DHL', code: 'DHL' },
  { name: 'Dilliking', code: 'DILLIKING' },
  { name: 'Dotzot', code: 'DOTZOT' },
  { name: 'DPD', code: 'DPD' },
  { name: 'DPD Germany', code: 'DPD Germany' },
  { name: 'DSK Cargo', code: 'DSK Cargo' },
  { name: 'Economic Trans Logistics', code: 'Economic Trans Logistics' },
  { name: 'ECSSPL', code: 'ECSSPL' },
  { name: 'Elbex Courier Service', code: 'Elbex Courier Service' },
  { name: 'eShipz', code: 'ESHIPZ' },
  { name: 'FedEx', code: 'FEDEX' },
  { name: 'Flight Go Express', code: 'Flight Go Express' },
  { name: 'Go Swift', code: 'GO SWIFT' },
  { name: 'Holisol Delivery', code: 'Holisol delivery' },
  { name: 'HPL Logistics Private Limited', code: 'HPL LOGISTICS PRIVATE LIMITED' },
  { name: 'India Worldwide Express', code: 'indiaworldwideexpress' },
  { name: 'IndiGo', code: 'INDIGO' },
  { name: 'iThink Logistics', code: 'ITHINK LOGISTICS' },
  { name: 'Kerry Indev', code: 'KERRYINDEV' },
  { name: 'Linex', code: 'LINEX' },
  { name: 'M5 Continent Logistics', code: 'M5 CONTINENT LOGISTICS' },
  { name: 'Madhur Courier', code: 'MADHUR COURIER' },
  { name: 'Mahanagar Courier', code: 'Mahanagar Courier' },
  { name: 'Mark Express', code: 'Mark Express' },
  { name: 'Mettur Transpots', code: 'Mettur Transpots' },
  { name: 'NAPLOG Logistics', code: 'NAPLOG Logistics' },
  { name: 'NimbusPost', code: 'NIMBUSPOST' },
  { name: 'Nitco', code: 'Nitco' },
  { name: 'OM Logistics', code: 'OM LOGISTICS' },
  { name: 'Patel Onboard Logistics', code: 'Patel Onboard Logistics' },
  { name: 'Pickrr', code: 'PICKRR' },
  { name: 'Pidge', code: 'PIDGE' },
  { name: 'Pikndel', code: 'PIKNDEL' },
  { name: 'Pragathi Logistics', code: 'Pragathi logistics' },
  { name: 'Proship', code: 'PROSHIP' },
  { name: 'Radiant Logistics', code: 'Radiant Logistics' },
  { name: 'Rivigo', code: 'RIVIGO' },
  { name: 'Royal Mail', code: 'ROYAL MAIL' },
  { name: 'Safe Express', code: 'safe express' },
  { name: 'Seenu Transport', code: 'Seenu Transport' },
  { name: 'Sequel', code: 'Sequel' },
  { name: 'Shiprocket', code: 'SHIP ROCKET' },
  { name: 'Shipease', code: 'SHIPEASE' },
  { name: 'ShipGlobal', code: 'Shipglobal' },
  { name: 'Shree Anjani Courier', code: 'SHREE ANJANI COURIER' },
  { name: 'Shree Mahavir Express', code: 'SHREE MAHAVIR EXPRESS' },
  { name: 'Shree Nandan Courier', code: 'SHREE NANDAN COURIER' },
  { name: 'Shyplite', code: 'SHYPLITE' },
  { name: 'Skyking', code: 'SKYKING' },
  { name: 'SkyNet', code: 'SKYNET' },
  { name: 'SkyNet World Wide', code: 'SKYNET World Wide' },
  { name: 'SpiceJet', code: 'SPICEJET' },
  { name: 'TCI Express', code: 'TCIEXPRESS' },
  { name: 'TNT', code: 'TNT' },
  { name: 'Total Courier', code: 'TOTALCOURIER' },
  { name: 'UBX', code: 'UBX' },
  { name: 'UPS', code: 'UPS' },
  { name: 'USPS', code: 'USPS' },
  { name: 'VRL Logistics', code: 'VRL Logistics' },
  { name: 'Yodel', code: 'YODEL' },
];

const ALL_COURIERS = [...POPULAR_COURIERS, ...OTHER_COURIERS];

const SYNC_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes
const SYNC_FEE_RUPEES = 5; // ₹5 per live courier sync

const OWNER_UPI_ID = import.meta.env.VITE_OWNER_UPI_ID || 'yourname@okaxis';
const OWNER_PAYEE_NAME = import.meta.env.VITE_OWNER_PAYEE_NAME || 'WISMO Credits';
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();

function buildUpiUri(amount, note) {
  const cleanAmt = Math.max(1, Number(amount) || 299);
  const params = new URLSearchParams({
    pa: OWNER_UPI_ID,
    pn: OWNER_PAYEE_NAME,
    am: cleanAmt.toFixed(2),
    cu: 'INR',
    tn: note || 'WISMO Credit Recharge',
  });
  return `upi://pay?${params.toString()}`;
}

async function syncShipmentWithCourier(shipment) {
  const { data, error } = await supabase.functions.invoke('sync-shipment', {
    body: {
      shipmentId: shipment.id,
      awb: shipment.awb_number,
      courierCode: shipment.courier_code || 'STCOURIER',
    },
  });

  if (error) {
    console.error('Edge function error:', error.message);
    return { success: false, error: error.message };
  }

  return data;
}

const STATUS_STEPS = [
  'Order Packed',
  'Picked up by ST Courier',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildWhatsAppLink(phone, brandName, orderId, courier, awb, trackUrl) {
  const digits = (phone || '').replace(/\D/g, '');
  const intlPhone = digits.length === 10 ? `91${digits}` : digits;
  const msg =
    `Hi! Your order #${orderId} from ${brandName} has been shipped via ${courier} ` +
    `(AWB: ${awb}). Track your shipment live: ${trackUrl}`;
  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
}

function getInitialCourierCode() {
  try {
    const saved = localStorage.getItem('wismo_last_courier');
    if (saved && ALL_COURIERS.some((c) => c.code === saved)) {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return 'STCOURIER';
}

function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brandName, setBrandName] = useState('');
  const [whatsappSupport, setWhatsappSupport] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const cleanSlug = slugify(brandName);
        if (!cleanSlug) throw new Error('Please enter a valid brand name (e.g., Parambhara).');

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (authData.session && authData.user) {
          const { error: vendorError } = await supabase.from('vendors').insert({
            owner_id: authData.user.id,
            brand_name: brandName.trim(),
            slug: cleanSlug,
            primary_color: '#7C2D12',
            whatsapp_support: whatsappSupport.trim(),
            credit_balance: 0,
          });
          if (vendorError) throw vendorError;
          navigate('/dashboard');
        } else {
          setErrorMsg('Account created! Check your email to confirm, or disable email confirmation in Supabase Auth for instant testing.');
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '48px auto', padding: 24, fontFamily: 'sans-serif', border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <h2 style={{ marginTop: 0 }}>{mode === 'login' ? 'Vendor Login' : 'Create Vendor Account'}</h2>
      <p style={{ color: '#6b7280', fontSize: 14 }}>
        Branded order tracking & WhatsApp updates for online sellers.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button type="button" onClick={() => setMode('login')} style={{ flex: 1, padding: 8, cursor: 'pointer' }}>
          Login
        </button>
        <button type="button" onClick={() => setMode('signup')} style={{ flex: 1, padding: 8, cursor: 'pointer' }}>
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mode === 'signup' && (
          <>
            <input
              type="text"
              placeholder="Brand / Store Name (e.g., Parambhara)"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
              style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
            />
            <input
              type="text"
              placeholder="Support WhatsApp (e.g., 919876543210)"
              value={whatsappSupport}
              onChange={(e) => setWhatsappSupport(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
        />

        {errorMsg && <div style={{ color: '#b91c1c', fontSize: 13 }}>{errorMsg}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 12, borderRadius: 8, border: 'none', background: '#111827', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Store & Continue'}
        </button>
      </form>
    </div>
  );
}

function DashboardPage() {
  const [session, setSession] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingShipment, setSubmittingShipment] = useState(false);
  const [syncingId, setSyncingId] = useState(null);
  const [setupBrand, setSetupBrand] = useState('');
  const [setupPhone, setSetupPhone] = useState('');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Store Settings states
  const [showSettings, setShowSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    primary_color: '#7C2D12',
    whatsapp_support: '',
    promo_text: '',
  });

  // Recharge & UPI QR Modal states
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(500);
  const [utrReference, setUtrReference] = useState('');
  const [submittingRecharge, setSubmittingRecharge] = useState(false);
  const [rechargeNotice, setRechargeNotice] = useState('');

  // Admin Top-Up Approval states
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processingReqId, setProcessingReqId] = useState(null);

  const [form, setForm] = useState(() => ({
    customer_name: '',
    customer_phone: '',
    order_id: '',
    courier_code: getInitialCourierCode(),
    awb_number: '',
    status: 'Picked up by ST Courier',
    eta_text: 'Arriving in 2–3 days',
  }));
  const navigate = useNavigate();

  const isAdmin = Boolean(ADMIN_EMAIL && session?.user?.email?.toLowerCase() === ADMIN_EMAIL);

  useEffect(() => {
    let active = true;
    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session) {
        navigate('/login');
        return;
      }
      setSession(data.session);
      await loadVendorAndShipments(data.session.user.id, data.session.user.email);
      if (active) setLoading(false);
    }
    init();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function loadPendingRequests() {
    const { data, error } = await supabase
      .from('credit_requests')
      .select('id, vendor_id, amount, utr_reference, status, created_at, vendors(brand_name, slug, credit_balance)')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (!error) {
      setPendingRequests(data || []);
    }
  }

  async function loadVendorAndShipments(userId, userEmail) {
    const { data: vData } = await supabase
      .from('vendors')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle();

    setVendor(vData || null);

    if (vData) {
      setSettingsForm({
        primary_color: vData.primary_color || '#7C2D12',
        whatsapp_support: vData.whatsapp_support || '',
        promo_text: vData.promo_text || '',
      });
      await fetchShipmentsForVendor(vData.id);
    }

    if (ADMIN_EMAIL && userEmail?.toLowerCase() === ADMIN_EMAIL) {
      await loadPendingRequests();
    }
  }

  async function fetchShipmentsForVendor(vendorId) {
    const { data: sData } = await supabase
      .from('shipments')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    setShipments(sData || []);
  }

  async function refreshVendorBalance(vendorId) {
    const { data } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .maybeSingle();
    if (data) setVendor(data);
  }

  async function handleApproveRequest(reqId) {
    setProcessingReqId(reqId);
    try {
      const { error } = await supabase.rpc('approve_credit_request', { p_request_id: reqId });
      if (error) {
        alert(error.message);
        return;
      }
      await Promise.all([
        loadPendingRequests(),
        vendor ? refreshVendorBalance(vendor.id) : Promise.resolve(),
      ]);
    } finally {
      setProcessingReqId(null);
    }
  }

  async function handleRejectRequest(reqId) {
    setProcessingReqId(reqId);
    try {
      const { error } = await supabase
        .from('credit_requests')
        .update({ status: 'REJECTED' })
        .eq('id', reqId);
      if (error) {
        alert(error.message);
        return;
      }
      await loadPendingRequests();
    } finally {
      setProcessingReqId(null);
    }
  }

  async function createMissingVendorProfile(e) {
    e.preventDefault();
    const cleanSlug = slugify(setupBrand);
    if (!cleanSlug || !session?.user) return;
    const { data, error } = await supabase
      .from('vendors')
      .insert({
        owner_id: session.user.id,
        brand_name: setupBrand.trim(),
        slug: cleanSlug,
        primary_color: '#7C2D12',
        whatsapp_support: setupPhone.trim(),
        credit_balance: 0,
      })
      .select()
      .single();
    if (error) {
      alert(error.message);
      return;
    }
    setVendor(data);
    setSettingsForm({
      primary_color: data.primary_color || '#7C2D12',
      whatsapp_support: data.whatsapp_support || '',
      promo_text: data.promo_text || '',
    });
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    if (!vendor) return;
    setSavingSettings(true);
    const { data, error } = await supabase
      .from('vendors')
      .update({
        primary_color: settingsForm.primary_color,
        whatsapp_support: settingsForm.whatsapp_support.trim(),
        promo_text: settingsForm.promo_text.trim(),
      })
      .eq('id', vendor.id)
      .select()
      .single();

    setSavingSettings(false);
    if (error) {
      alert(error.message);
      return;
    }
    setVendor(data);
    setShowSettings(false);
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !vendor || !session?.user) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const filePath = `${session.user.id}/logo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('vendor-logos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from('vendor-logos').getPublicUrl(filePath);
    const cacheBustedUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { data: updatedVendor, error: updateError } = await supabase
      .from('vendors')
      .update({ logo_url: cacheBustedUrl })
      .eq('id', vendor.id)
      .select()
      .single();

    if (updateError) {
      alert(updateError.message);
      return;
    }
    setVendor(updatedVendor);
  }

  async function handleRechargeSubmit(e) {
    e.preventDefault();
    if (!vendor || submittingRecharge) return;
    const amt = Number(rechargeAmount);
    if (!amt || amt < 5) {
      alert('Please enter an amount of at least ₹5.');
      return;
    }

    setSubmittingRecharge(true);
    setRechargeNotice('');
    try {
      const { error } = await supabase.from('credit_requests').insert({
        vendor_id: vendor.id,
        amount: amt,
        utr_reference: utrReference.trim() || null,
        status: 'PENDING',
      });

      if (error) {
        alert(error.message);
        return;
      }

      setUtrReference('');
      setRechargeNotice(
        `Recharge request for ₹${amt} submitted. Credits will appear once payment is verified.`
      );
      if (isAdmin) {
        await loadPendingRequests();
      }
    } finally {
      setSubmittingRecharge(false);
    }
  }

  async function handleCopyUpiId() {
    try {
      await navigator.clipboard.writeText(OWNER_UPI_ID);
      alert(`Copied UPI ID: ${OWNER_UPI_ID}`);
    } catch {
      alert(`UPI ID: ${OWNER_UPI_ID}`);
    }
  }

  async function handleAddShipment(e) {
    e.preventDefault();
    if (!vendor || submittingShipment) return;

    const currentBalance = Number(vendor.credit_balance ?? 0);
    if (currentBalance < SYNC_FEE_RUPEES) {
      setShowRechargeModal(true);
      alert(`Insufficient balance (₹${currentBalance}). Recharge at least ₹${SYNC_FEE_RUPEES} via UPI QR to run live courier sync.`);
      return;
    }

    setSubmittingShipment(true);

    const selectedCourier =
      ALL_COURIERS.find((c) => c.code === form.courier_code) || POPULAR_COURIERS[0];

    try {
      localStorage.setItem('wismo_last_courier', selectedCourier.code);
    } catch {
      // Ignore storage errors
    }

    const initialCheckpoint = [
      {
        status: form.status,
        location: 'Dispatch Origin',
        timestamp: new Date().toLocaleString('en-IN'),
      },
    ];

    const { data, error } = await supabase
      .from('shipments')
      .insert({
        vendor_id: vendor.id,
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        order_id: form.order_id.trim(),
        courier_name: selectedCourier.name,
        courier_code: selectedCourier.code,
        awb_number: form.awb_number.trim().toUpperCase(),
        status: form.status,
        eta_text: form.eta_text.trim(),
        checkpoints: initialCheckpoint,
      })
      .select()
      .single();

    if (error) {
      setSubmittingShipment(false);
      alert(error.message);
      return;
    }

    await syncShipmentWithCourier(data);
    await Promise.all([fetchShipmentsForVendor(vendor.id), refreshVendorBalance(vendor.id)]);

    setForm({
      customer_name: '',
      customer_phone: '',
      order_id: '',
      courier_code: selectedCourier.code,
      awb_number: '',
      status: 'Picked up by ST Courier',
      eta_text: 'Arriving in 2–3 days',
    });
    setSubmittingShipment(false);
  }

  async function handleManualSync(shipment) {
    if (!vendor) return;

    if (String(shipment.status).toLowerCase() === 'delivered') {
      alert('This shipment is already marked Delivered—no further courier sync needed.');
      return;
    }

    const currentBalance = Number(vendor.credit_balance ?? 0);
    if (currentBalance < SYNC_FEE_RUPEES) {
      setShowRechargeModal(true);
      alert(`Insufficient balance (₹${currentBalance}). Each live sync deducts ₹${SYNC_FEE_RUPEES}. Please recharge via UPI QR.`);
      return;
    }

    if (shipment.last_synced_at) {
      const elapsed = Date.now() - new Date(shipment.last_synced_at).getTime();
      if (elapsed < SYNC_COOLDOWN_MS) {
        const minsLeft = Math.ceil((SYNC_COOLDOWN_MS - elapsed) / 60000);
        alert(`Already synced recently. Please wait ${minsLeft} min(s) before syncing this AWB again.`);
        return;
      }
    }

    setSyncingId(shipment.id);
    try {
      const res = await syncShipmentWithCourier(shipment);
      if (res?.success) {
        await Promise.all([fetchShipmentsForVendor(vendor.id), refreshVendorBalance(vendor.id)]);
      } else {
        alert(res?.error || 'Could not fetch live courier updates yet.');
      }
    } finally {
      setSyncingId(null);
    }
  }

  async function handleStatusChange(shipment, nextStatus) {
    const nextCheckpoints = [
      ...(Array.isArray(shipment.checkpoints) ? shipment.checkpoints : []),
      {
        status: nextStatus,
        location: nextStatus === 'Delivered' ? 'Customer Address' : 'Transit Hub',
        timestamp: new Date().toLocaleString('en-IN'),
      },
    ];

    const { data, error } = await supabase
      .from('shipments')
      .update({
        status: nextStatus,
        checkpoints: nextCheckpoints,
        updated_at: new Date().toISOString(),
      })
      .eq('id', shipment.id)
      .select()
      .single();

    if (!error && data) {
      setShipments((prev) => prev.map((item) => (item.id === shipment.id ? data : item)));
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  if (loading) {
    return <div style={{ padding: 32, fontFamily: 'sans-serif' }}>Loading dashboard...</div>;
  }

  if (!vendor) {
    return (
      <form onSubmit={createMissingVendorProfile} style={{ maxWidth: 420, margin: '48px auto', padding: 24, fontFamily: 'sans-serif', border: '1px solid #e5e7eb', borderRadius: 12 }}>
        <h3>Complete Your Store Profile</h3>
        <input
          type="text"
          placeholder="Brand Name (e.g., Parambhara)"
          value={setupBrand}
          onChange={(e) => setSetupBrand(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <input
          type="text"
          placeholder="Support WhatsApp (e.g., 919876543210)"
          value={setupPhone}
          onChange={(e) => setSetupPhone(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <button type="submit" style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#111827', color: '#fff', cursor: 'pointer' }}>
          Save Store
        </button>
      </form>
    );
  }

  const filteredShipments = shipments.filter((s) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      String(s.status || '').toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesStatus;
    return (
      matchesStatus &&
      (String(s.order_id || '').toLowerCase().includes(q) ||
        String(s.customer_name || '').toLowerCase().includes(q) ||
        String(s.customer_phone || '').toLowerCase().includes(q) ||
        String(s.awb_number || '').toLowerCase().includes(q))
    );
  });

  const balanceNum = Number(vendor.credit_balance ?? 0);
  const upiUri = buildUpiUri(rechargeAmount, `${vendor.slug} credit top-up`);

  return (
    <div style={{ maxWidth: 980, margin: '24px auto', padding: 16, fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {vendor.logo_url && (
            <img src={vendor.logo_url} alt={vendor.brand_name} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8, border: '1px solid #e5e7eb' }} />
          )}
          <div>
            <h2 style={{ margin: 0 }}>{vendor.brand_name} — Dispatch Portal</h2>
            <small style={{ color: '#6b7280' }}>Tracking slug: /{vendor.slug} · ₹{SYNC_FEE_RUPEES}/live sync</small>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setRechargeNotice('');
              setShowRechargeModal((prev) => !prev);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: balanceNum < SYNC_FEE_RUPEES ? '#fef2f2' : '#ecfdf5',
              color: balanceNum < SYNC_FEE_RUPEES ? '#b91c1c' : '#065f46',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Balance: ₹{balanceNum.toFixed(0)} · + Recharge
          </button>
          <button
            type="button"
            onClick={() => setShowSettings((prev) => !prev)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: showSettings ? '#f3f4f6' : '#fff', cursor: 'pointer', fontSize: 13 }}
          >
            Store Settings
          </button>
          <label style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            Upload Logo
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoUpload} style={{ display: 'none' }} />
          </label>
          <button onClick={handleSignOut} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Admin Top-Up Approval Panel */}
      {isAdmin && (
        <div style={{ padding: 16, border: '1px solid #c7d2fe', borderRadius: 12, background: '#eef2ff', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <strong>Admin Top-Up Approval ({pendingRequests.length} Pending)</strong>
            <button
              type="button"
              onClick={loadPendingRequests}
              style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #c7d2fe', background: '#fff', cursor: 'pointer', fontSize: 12 }}
            >
              Refresh
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div style={{ fontSize: 13, color: '#4b5563' }}>No pending UPI recharge requests.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingRequests.map((item) => (
                <div
                  key={item.id}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: 10, borderRadius: 8, background: '#fff', border: '1px solid #e5e7eb', fontSize: 13 }}
                >
                  <div>
                    <strong>{item.vendors?.brand_name || item.vendor_id}</strong> (/{item.vendors?.slug}) —{' '}
                    <strong>₹{Number(item.amount).toFixed(0)}</strong>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>
                      UTR: {item.utr_reference || 'Not provided'} · Current Bal: ₹{Number(item.vendors?.credit_balance ?? 0).toFixed(0)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      disabled={processingReqId === item.id}
                      onClick={() => handleApproveRequest(item.id)}
                      style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}
                    >
                      {processingReqId === item.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      disabled={processingReqId === item.id}
                      onClick={() => handleRejectRequest(item.id)}
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: 12 }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* UPI QR Recharge Panel */}
      {showRechargeModal && (
        <div style={{ padding: 18, border: '1px solid #d1d5db', borderRadius: 12, background: '#f9fafb', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0 }}>Recharge Credits via UPI QR</h3>
              <small style={{ color: '#6b7280' }}>Each live courier sync deducts ₹{SYNC_FEE_RUPEES} from your credit balance.</small>
            </div>
            <button
              type="button"
              onClick={() => setShowRechargeModal(false)}
              style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: 12 }}
            >
              Close
            </button>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <QRCodeSVG value={upiUri} size={148} />
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>Scan & Pay ₹{Number(rechargeAmount || 0)}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{OWNER_UPI_ID}</div>
              <button
                type="button"
                onClick={handleCopyUpiId}
                style={{ marginTop: 6, padding: '4px 8px', borderRadius: 6, border: '1px solid #d1d5db', background: '#f9fafb', cursor: 'pointer', fontSize: 11 }}
              >
                Copy UPI ID
              </button>
            </div>

            <form onSubmit={handleRechargeSubmit} style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[299, 500, 599, 1199].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRechargeAmount(preset)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      background: Number(rechargeAmount) === preset ? '#111827' : '#fff',
                      color: Number(rechargeAmount) === preset ? '#fff' : '#111827',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>Amount (₹)</label>
                <input
                  type="number"
                  min={5}
                  step="1"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  required
                  style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #d1d5db', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>UPI UTR / Reference # (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., 633112345678"
                  value={utrReference}
                  onChange={(e) => setUtrReference(e.target.value)}
                  style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #d1d5db', background: '#fff' }}
                />
              </div>

              {rechargeNotice && (
                <div style={{ fontSize: 12, color: '#065f46', background: '#ecfdf5', padding: 8, borderRadius: 8 }}>
                  {rechargeNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={submittingRecharge}
                style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: '#111827', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                {submittingRecharge ? 'Submitting...' : 'I Have Paid — Submit Top-Up Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showSettings && (
        <form onSubmit={handleSaveSettings} style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 12, background: '#f9fafb', marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>Brand Accent Color</label>
            <input
              type="color"
              value={settingsForm.primary_color}
              onChange={(e) => setSettingsForm({ ...settingsForm, primary_color: e.target.value })}
              style={{ width: '100%', height: 38, padding: 2, borderRadius: 8, border: '1px solid #d1d5db', background: '#fff' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>Support WhatsApp Number</label>
            <input
              type="text"
              placeholder="e.g., 919876543210"
              value={settingsForm.whatsapp_support}
              onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_support: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #d1d5db' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>Tracking Page Promo Banner</label>
            <input
              type="text"
              placeholder="e.g., Use code PARA10 for 10% off next order!"
              value={settingsForm.promo_text}
              onChange={(e) => setSettingsForm({ ...settingsForm, promo_text: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #d1d5db' }}
            />
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: '#111827', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
          >
            {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      )}

      <form onSubmit={handleAddShipment} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 10, padding: 16, border: '1px solid #e5e7eb', borderRadius: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Customer Name"
          value={form.customer_name}
          onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <input
          type="text"
          placeholder="WhatsApp Phone (10 digits)"
          value={form.customer_phone}
          onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <input
          type="text"
          placeholder="Order ID (e.g., ORD-104)"
          value={form.order_id}
          onChange={(e) => setForm({ ...form, order_id: e.target.value })}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <select
          value={form.courier_code}
          onChange={(e) => setForm({ ...form, courier_code: e.target.value })}
          style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db', background: '#fff' }}
        >
          <optgroup label="Popular Couriers">
            {POPULAR_COURIERS.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </optgroup>
          <optgroup label="All Supported Couriers (A–Z)">
            {OTHER_COURIERS.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </optgroup>
        </select>
        <input
          type="text"
          placeholder="AWB / Tracking #"
          value={form.awb_number}
          onChange={(e) => setForm({ ...form, awb_number: e.target.value })}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <button
          type="submit"
          disabled={submittingShipment}
          style={{ padding: 10, borderRadius: 8, border: 'none', background: vendor.primary_color || '#7C2D12', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          {submittingShipment ? 'Adding & Syncing...' : '+ Add Shipment'}
        </button>
      </form>

      {/* Search & Status Filter Bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by Order ID, Customer, Phone, or AWB..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 220, padding: 9, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: 9, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, background: '#fff' }}
        >
          <option value="ALL">All Statuses ({shipments.length})</option>
          {STATUS_STEPS.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: 10 }}>Order / Customer</th>
              <th style={{ padding: 10 }}>Courier & AWB</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShipments.map((s) => {
              const trackPath = `/t/${vendor.slug}/${encodeURIComponent(s.awb_number)}`;
              const fullTrackUrl = `${window.location.origin}${trackPath}`;
              const waUrl = buildWhatsAppLink(
                s.customer_phone,
                vendor.brand_name,
                s.order_id,
                s.courier_name,
                s.awb_number,
                fullTrackUrl
              );
              const isSyncing = syncingId === s.id;
              const isDelivered = String(s.status || '').toLowerCase() === 'delivered';

              return (
                <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: 10 }}>
                    <strong>#{s.order_id}</strong> — {s.customer_name}
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{s.customer_phone}</div>
                  </td>
                  <td style={{ padding: 10 }}>
                    {s.courier_name} · <code>{s.awb_number}</code>
                    {s.last_synced_at && (
                      <div style={{ fontSize: 11, color: '#6b7280' }}>
                        Synced: {new Date(s.last_synced_at).toLocaleTimeString('en-IN')}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 10 }}>
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s, e.target.value)}
                      style={{ padding: 6, borderRadius: 6, border: '1px solid #d1d5db' }}
                    >
                      {!STATUS_STEPS.includes(s.status) && (
                        <option value={s.status}>{s.status}</option>
                      )}
                      {STATUS_STEPS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      type="button"
                      disabled={isSyncing || isDelivered}
                      onClick={() => handleManualSync(s)}
                      title={isDelivered ? 'Already delivered' : `Sync live (₹${SYNC_FEE_RUPEES})`}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid #d1d5db',
                        background: isDelivered ? '#f3f4f6' : '#f9fafb',
                        color: isDelivered ? '#9ca3af' : '#111827',
                        fontSize: 13,
                        cursor: isDelivered ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isSyncing ? 'Syncing...' : isDelivered ? 'Delivered' : `Sync Live (₹${SYNC_FEE_RUPEES})`}
                    </button>
                    <Link to={trackPath} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', textDecoration: 'none', color: '#111827', fontSize: 13 }}>
                      Track Page
                    </Link>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: '6px 10px', borderRadius: 6, background: '#16a34a', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
                    >
                      Share WhatsApp
                    </a>
                  </td>
                </tr>
              );
            })}
            {filteredShipments.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>
                  {shipments.length === 0
                    ? 'No shipments yet. Add your first ST Courier tracking number above.'
                    : 'No shipments match your search or status filter.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PublicTrackingPage() {
  const { slug, awb } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchTracking() {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_tracking_shipment', {
        p_slug: slug,
        p_awb: awb,
      });
      if (active) {
        if (!error && Array.isArray(data) && data.length > 0) {
          setRecord(data[0]);
        } else {
          setRecord(null);
        }
        setLoading(false);
      }
    }
    fetchTracking();
    return () => {
      active = false;
    };
  }, [slug, awb]);

  if (loading) {
    return <div style={{ padding: 32, textAlign: 'center', fontFamily: 'sans-serif' }}>Fetching live shipment status...</div>;
  }

  if (!record) {
    return (
      <div style={{ maxWidth: 480, margin: '64px auto', padding: 24, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h3>Shipment not found</h3>
        <p style={{ color: '#6b7280' }}>Check the tracking ID or contact the seller for assistance.</p>
      </div>
    );
  }

  const accent = record.primary_color || '#7C2D12';
  const checkpoints = Array.isArray(record.checkpoints) ? record.checkpoints : [];
  const supportDigits = (record.whatsapp_support || '').replace(/\D/g, '');
  const supportHref = supportDigits
    ? `https://wa.me/${supportDigits.length === 10 ? `91${supportDigits}` : supportDigits}?text=${encodeURIComponent(
        `Hi ${record.brand_name}, I need help with Order #${record.order_id} (AWB: ${record.awb_number}).`
      )}`
    : null;

  return (
    <div style={{ maxWidth: 520, margin: '32px auto', padding: 16, fontFamily: 'sans-serif' }}>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
        <div style={{ background: accent, color: '#fff', padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {record.logo_url && (
              <img src={record.logo_url} alt={record.brand_name} style={{ width: 42, height: 42, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 4 }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{record.brand_name}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Order #{record.order_id}</div>
            </div>
          </div>
          {supportHref && (
            <a href={supportHref} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
              Need Help?
            </a>
          )}
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{record.status}</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            {record.courier_name} · AWB <strong>{record.awb_number}</strong> · {record.eta_text}
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#374151' }}>Shipment Timeline</div>
            {checkpoints.length > 0 ? (
              checkpoints.map((cp, idx) => (
                <div key={idx} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{cp.status}</div>
                  <div style={{ color: '#6b7280', fontSize: 12 }}>
                    {cp.location} · {cp.timestamp}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, color: '#6b7280' }}>Current status: {record.status}</div>
            )}
          </div>

          {record.promo_text && (
            <div style={{ marginTop: 20, padding: 12, borderRadius: 10, background: '#fef3c7', color: '#78350f', fontSize: 13, fontWeight: 500 }}>
              {record.promo_text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/t/:slug/:awb" element={<PublicTrackingPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}