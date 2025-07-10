let productos = [];

function agregarProducto() {
  let nombre = document.getElementById("nombre").value;
  let precio = parseFloat(document.getElementById("precio").value);
  let cantidad = parseInt(document.getElementById("cantidad").value);

  if (!nombre || isNaN(precio) || isNaN(cantidad)) {
    alert("Por favor completa todos los campos correctamente.");
    return;
  }

  let subtotal = precio * cantidad;
  let producto = { nombre, precio, cantidad, subtotal };
  productos.push(producto);

  let tabla = document.getElementById("tabla-productos");
  let fila = document.createElement("tr");

  fila.innerHTML = `
  <td>${nombre}</td>
  <td>$${precio.toFixed(2)}</td>
  <td>${cantidad}</td>
  <td>$${subtotal.toFixed(2)}</td>
  <td><button onclick="eliminarProducto(this, ${subtotal})">Eliminar</button></td>
`;


    tabla.appendChild(fila);

  actualizarTotal();

  // Limpiar los inputs
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("nombre").focus(); // vuelve al campo "nombre"

  console.log(productos); // por ahora lo mostramos en la consola

}

function actualizarTotal() {
  let total = 0;
  productos.forEach(p => {
    total += p.subtotal;
  });

  document.getElementById("total-general").textContent = `$${total.toFixed(2)}`;
  
}

function eliminarProducto(boton, subtotal) {
  let fila= boton.parentElement.parentElement;
  fila.remove();

  let totalTexto = document.getElementById("total-general").textContent.replace('$', '');
  let total = parseFloat(totalTexto);
   total -= subtotal;
   document.getElementById("total-general").textContent = `$${total.toFixed(2)}`;
}

// Detectar Enter en los campos
["nombre", "precio", "cantidad"].forEach(id => {
  document.getElementById(id).addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      agregarProducto();
    }
  });
});

function descargarExcel() {
  let tabla = document.getElementById("tabla-productos");
  let wb = XLSX.utils.table_to_book(tabla, { sheet: "Productos" });
  XLSX.writeFile(wb, "productos.xlsx");
}
async function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Productos Agregados", 10, 10);
  let y = 20;
  productos.forEach((p, index) => {
    doc.text(`${index + 1}. ${p.nombre} - $${p.precio} x ${p.cantidad} = $${p.subtotal}`, 10, y);
    y += 10;
  });

  doc.text(`Total: $${productos.reduce((t, p) => t + p.subtotal, 0).toFixed(2)}`, 10, y + 10);
  doc.save("productos.pdf");
}




