import React, { useState } from "react";

// --- CONFIGURACIÓN ---
const USERS: Record<string, { user: string; pass: string; role: string }> = {
  administrador: {
    user: "lacantinadelclub7",
    pass: "admin1234",
    role: "admin",
  },
  mostrador: { user: "mostrador1", pass: "demo12345", role: "mostrador" },
  cocina: { user: "cocina1", pass: "demo12345", role: "cocina" },
};

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzfJW5dNGKZUInm-cQA6PyfvhoTz4duZwgDeVIEmXaIjWsYy69dy8Vu1gmqmQKSliCJQA/exec";

// --- MENÚ ORIGINAL ---
const MENU: Record<string, string[]> = {
  Empanadas: [
    "Árabes",
    "Jamón y Queso",
    "Cebolla y Queso",
    "Criollas",
    "Salteñas",
    "Verdura",
    "Capresse",
  ],
  Tartas: ["Zapallo", "Zapallito verde", "Verdura", "Atún", "Choclo"],
  Sandwiches: [
    "Lomito completo",
    "Lomito sin (agregar descripción)",
    "Sandwich de milanesa completo",
    "Sandwich de milanesa sin (agregar descripción)",
    "Hamburguesa completa",
    "Hamburguesa sin (agregar descripción)",
    "Lomito Veggie",
    "Sandwich especialidad",
  ],
  Pizzas: [
    "Fuggazeta",
    "Napolitana",
    "4 Quesos",
    "Muzza",
    "Especial",
    "Descripción de pedido particular",
  ],
  "Al plato": ["Milanesa", "Lomito", "Hamburguesa"],
  Pastas: [
    "Ñoquis (describir tipo de salsa)",
    "Sorrentinos (describir tipo de sorrentino y tipo de salsa)",
    "Tallarines (describir tipo de salsa)",
  ],
  "Plato Especialidad": ["Describir pedido"],
};

// --- ESTILOS VISUALES ---
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    padding: 0,
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
  },
  header: {
    background: "#1a1a1a",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  buttonPrimary: {
    background: "#0066cc",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonSuccess: {
    background: "#28a745",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonDanger: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  card: {
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "5px 0 15px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
  },
};

interface PedidoItem {
  id: number;
  prod: string;
  cant: number;
  nota: string;
}

interface Pedido {
  id: number;
  numero: number;
  fecha: string;
  cliente: string;
  descripcion: string;
  pago: string;
  monto: string | number;
  tipo: string;
  estado: string;
  horaListo: number | null;
}

export default function AppCantina() {
  const [currentUser, setCurrentUser] = useState<{
    user: string;
    role: string;
  } | null>(null);
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [numeroPedidoMensual, setNumeroPedidoMensual] = useState(1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = Object.values(USERS).find(
      (u) => u.user === loginForm.user && u.pass === loginForm.pass
    );
    if (foundUser) setCurrentUser(foundUser);
    else alert("Usuario o clave incorrectos");
  };

  if (!currentUser) {
    return (
      <div
        style={{
          ...styles.container,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ ...styles.card, width: "100%", maxWidth: "400px" }}>
          <h2 style={{ textAlign: "center", color: "#333" }}>
            La Cantina del Club
          </h2>
          <form onSubmit={handleLogin}>
            <label style={{ fontWeight: "bold" }}>Usuario:</label>
            <input
              type="text"
              value={loginForm.user}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLoginForm({ ...loginForm, user: e.target.value })
              }
              required
              style={styles.input}
            />
            <label style={{ fontWeight: "bold" }}>Clave:</label>
            <input
              type="password"
              value={loginForm.pass}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLoginForm({ ...loginForm, pass: e.target.value })
              }
              required
              style={styles.input}
            />
            <button
              type="submit"
              style={{
                ...styles.buttonPrimary,
                width: "100%",
                padding: "12px",
              }}
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 1. MOSTRADOR ---
  const VistaMostrador = () => {
    const [cliente, setCliente] = useState("");
    const [tipo, setTipo] = useState("para llevar");
    const [pago, setPago] = useState("si");
    const [monto, setMonto] = useState("");

    const [carrito, setCarrito] = useState<PedidoItem[]>([]);
    const [catSel, setCatSel] = useState("");
    const [prodSel, setProdSel] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [aclaracion, setAclaracion] = useState("");

    const requiereAclaracion =
      prodSel.includes("describir") || prodSel.includes("descripción");

    const agregarAlCarrito = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!prodSel) return;
      setCarrito([
        ...carrito,
        {
          id: Date.now(),
          prod: prodSel,
          cant: Number(cantidad),
          nota: requiereAclaracion ? aclaracion : "",
        },
      ]);
      setProdSel("");
      setCantidad(1);
      setAclaracion("");
    };

    const enviarPedido = (e: React.MouseEvent) => {
      e.preventDefault();
      if (carrito.length === 0) return alert("Agrega productos al pedido.");
      const descripcion = carrito
        .map((i) => `${i.cant}x ${i.prod}${i.nota ? ` (${i.nota})` : ""}`)
        .join("\n");

      setPedidos([
        ...pedidos,
        {
          id: Date.now(),
          numero: numeroPedidoMensual,
          fecha: new Date().toISOString(),
          cliente,
          descripcion,
          pago,
          monto: pago === "no" ? monto : 0,
          tipo,
          estado: "en cola",
          horaListo: null,
        },
      ]);
      setNumeroPedidoMensual(numeroPedidoMensual + 1);
      setCliente("");
      setCarrito([]);
      setMonto("");
      alert("¡Pedido enviado a cocina!");
    };

    return (
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ ...styles.card, flex: 1, minWidth: "300px" }}>
          <h3>1. Datos del Pedido</h3>
          <input
            type="text"
            placeholder="Nombre del Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
            style={styles.input}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={{ ...styles.input, flex: 1 }}
            >
              <option value="para llevar">Para llevar</option>
              <option value="en mesa">Comer en mesa</option>
              <option value="delivery">Delivery</option>
            </select>
            <select
              value={pago}
              onChange={(e) => setPago(e.target.value)}
              style={{ ...styles.input, flex: 1 }}
            >
              <option value="si">Abonó (Sí)</option>
              <option value="no">Abonó (No)</option>
            </select>
          </div>
          {pago === "no" && (
            <input
              type="number"
              placeholder="Monto a pagar ($)"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              style={styles.input}
            />
          )}
        </div>

        <div style={{ ...styles.card, flex: 2, minWidth: "400px" }}>
          <h3>2. Seleccionar Productos</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={catSel}
              onChange={(e) => {
                setCatSel(e.target.value);
                setProdSel("");
              }}
              style={{ ...styles.input, flex: 1 }}
            >
              <option value="">- Categoría -</option>
              {Object.keys(MENU).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {catSel && (
              <select
                value={prodSel}
                onChange={(e) => setProdSel(e.target.value)}
                style={{ ...styles.input, flex: 2 }}
              >
                <option value="">- Producto -</option>
                {MENU[catSel].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              style={{ ...styles.input, width: "70px" }}
            />
            <button
              onClick={agregarAlCarrito}
              style={{
                ...styles.buttonPrimary,
                marginTop: "5px",
                height: "40px",
              }}
            >
              Agregar
            </button>
          </div>
          {requiereAclaracion && (
            <input
              type="text"
              placeholder="Aclaración (ej. Sin mayonesa)"
              value={aclaracion}
              onChange={(e) => setAclaracion(e.target.value)}
              style={styles.input}
            />
          )}

          <div
            style={{
              marginTop: "15px",
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <h4>Detalle del Carrito</h4>
            {carrito.length === 0 ? (
              <p style={{ color: "#666" }}>Vacío.</p>
            ) : (
              <ul style={{ padding: 0 }}>
                {carrito.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #ddd",
                      padding: "5px 0",
                    }}
                  >
                    <span>
                      <strong>{item.cant}x</strong> {item.prod}{" "}
                      <i>{item.nota}</i>
                    </span>
                    <button
                      onClick={() =>
                        setCarrito(carrito.filter((i) => i.id !== item.id))
                      }
                      style={{
                        color: "red",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={enviarPedido}
            style={{
              ...styles.buttonSuccess,
              width: "100%",
              marginTop: "15px",
              padding: "15px",
              fontSize: "16px",
            }}
            disabled={carrito.length === 0 || !cliente}
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    );
  };

  // --- 2. COCINA ---
  const VistaCocina = () => {
    const pedidosActivos = pedidos.filter(
      (p) => p.estado === "en cola" || p.estado === "en curso"
    );
    const cambiarEstado = (id: number, nuevoEstado: string) =>
      setPedidos(
        pedidos.map((p) =>
          p.id === id
            ? {
                ...p,
                estado: nuevoEstado,
                horaListo: nuevoEstado === "listo" ? Date.now() : p.horaListo,
              }
            : p
        )
      );

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {pedidosActivos.map((p) => (
          <div
            key={p.id}
            style={{
              ...styles.card,
              borderTop: `5px solid ${
                p.estado === "en curso" ? "#fd7e14" : "#6c757d"
              }`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              <h2 style={{ margin: 0 }}>#{p.numero}</h2>
              <span
                style={{
                  background: "#e9ecef",
                  padding: "5px 10px",
                  borderRadius: "15px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {p.tipo.toUpperCase()}
              </span>
            </div>
            <p>
              <strong>Cliente:</strong> {p.cliente}
            </p>
            <div
              style={{
                background: "#fff3cd",
                padding: "10px",
                borderRadius: "5px",
                whiteSpace: "pre-line",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {p.descripcion}
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              {p.estado === "en cola" && (
                <button
                  onClick={() => cambiarEstado(p.id, "en curso")}
                  style={{
                    ...styles.buttonPrimary,
                    background: "#fd7e14",
                    flex: 1,
                  }}
                >
                  Comenzar
                </button>
              )}
              {p.estado === "en curso" && (
                <button
                  onClick={() => cambiarEstado(p.id, "listo")}
                  style={{ ...styles.buttonSuccess, flex: 1 }}
                >
                  Marcar Listo
                </button>
              )}
              <button
                onClick={() => cambiarEstado(p.id, "cancelado")}
                style={styles.buttonDanger}
              >
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // --- 3. EXTERNA ---
  const VistaExterna = () => (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: "#00ff00",
          fontSize: "4rem",
          textShadow: "0 0 20px #00ff00",
          marginBottom: "40px",
        }}
      >
        PEDIDOS LISTOS
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        {pedidos
          .filter((p) => p.estado === "listo")
          .map((p) => (
            <div
              key={p.id}
              style={{
                border: "4px solid #00ff00",
                borderRadius: "20px",
                padding: "30px 50px",
                textAlign: "center",
                minWidth: "200px",
              }}
            >
              <div
                style={{ color: "white", fontSize: "5rem", fontWeight: "900" }}
              >
                #{p.numero}
              </div>
              <div
                style={{
                  color: "#00ff00",
                  fontSize: "2rem",
                  marginTop: "10px",
                  fontWeight: "bold",
                }}
              >
                {p.cliente}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>
          La Cantina del Club | Panel: {currentUser.role.toUpperCase()}
        </h3>
        <button
          onClick={() => setCurrentUser(null)}
          style={styles.buttonDanger}
        >
          Cerrar Sesión
        </button>
      </div>
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {currentUser.role === "mostrador" && <VistaMostrador />}
        {currentUser.role === "cocina" && <VistaCocina />}
        {currentUser.role === "externa" && <VistaExterna />}
      </div>
    </div>
  );
}
