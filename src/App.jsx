import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

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
  const [setupBrand, setSetupBrand] = useState('');
  const [setupPhone, setSetupPhone] = useState('');
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    order_id: '',
    courier_name: 'ST Courier',
    awb_number: '',
    status: 'Picked up by ST Courier',
    eta_text: 'Arriving in 2–3 days',
  });
  const navigate = useNavigate();

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
      await loadVendorAndShipments(data.session.user.id);
      if (active) setLoading(false);
    }
    init();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function loadVendorAndShipments(userId) {
    const { data: vData } = await supabase
      .from('vendors')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle();

    setVendor(vData || null);

    if (vData) {
      const { data: sData } = await supabase
        .from('shipments')
        .select('*')
        .eq('vendor_id', vData.id)
        .order('created_at', { ascending: false });
      setShipments(sData || []);
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
      })
      .select()
      .single();
    if (error) {
      alert(error.message);
      return;
    }
    setVendor(data);
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

  async function handleAddShipment(e) {
    e.preventDefault();
    if (!vendor) return;
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
        courier_name: form.courier_name.trim() || 'ST Courier',
        awb_number: form.awb_number.trim().toUpperCase(),
        status: form.status,
        eta_text: form.eta_text.trim(),
        checkpoints: initialCheckpoint,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setShipments((prev) => [data, ...prev]);
    setForm({
      customer_name: '',
      customer_phone: '',
      order_id: '',
      courier_name: 'ST Courier',
      awb_number: '',
      status: 'Picked up by ST Courier',
      eta_text: 'Arriving in 2–3 days',
    });
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

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', padding: 16, fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {vendor.logo_url && (
            <img src={vendor.logo_url} alt={vendor.brand_name} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8, border: '1px solid #e5e7eb' }} />
          )}
          <div>
            <h2 style={{ margin: 0 }}>{vendor.brand_name} — Dispatch Portal</h2>
            <small style={{ color: '#6b7280' }}>Tracking slug: /{vendor.slug}</small>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <label style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            Upload Logo
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoUpload} style={{ display: 'none' }} />
          </label>
          <button onClick={handleSignOut} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </header>

      <form onSubmit={handleAddShipment} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, padding: 16, border: '1px solid #e5e7eb', borderRadius: 12, marginBottom: 24 }}>
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
          placeholder="WhatsApp Phone (e.g., 9876543210)"
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
        <input
          type="text"
          placeholder="Courier (ST Courier)"
          value={form.courier_name}
          onChange={(e) => setForm({ ...form, courier_name: e.target.value })}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <input
          type="text"
          placeholder="AWB / Tracking #"
          value={form.awb_number}
          onChange={(e) => setForm({ ...form, awb_number: e.target.value })}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <button type="submit" style={{ padding: 10, borderRadius: 8, border: 'none', background: vendor.primary_color || '#7C2D12', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          + Add Shipment
        </button>
      </form>

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
            {shipments.map((s) => {
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

              return (
                <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: 10 }}>
                    <strong>#{s.order_id}</strong> — {s.customer_name}
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{s.customer_phone}</div>
                  </td>
                  <td style={{ padding: 10 }}>
                    {s.courier_name} · <code>{s.awb_number}</code>
                  </td>
                  <td style={{ padding: 10 }}>
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s, e.target.value)}
                      style={{ padding: 6, borderRadius: 6, border: '1px solid #d1d5db' }}
                    >
                      {STATUS_STEPS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
            {shipments.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>
                  No shipments yet. Add your first ST Courier tracking number above.
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