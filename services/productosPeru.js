/**
 * Catálogo de productos optimizado con iconos de alta calidad (MaterialCommunityIcons)
 * Se han seleccionado nombres de iconos descriptivos y modernos para una mejor experiencia visual.
 */

const productosPeruBase = [
  // LÁCTEOS (Gloria, Laive, Ideal)
  { id_api: 'L01', nombre: 'Leche Evaporada Entera 400g', marca: 'Gloria', icono: 'cow', categoria: 'Lácteos' },
  { id_api: 'L02', nombre: 'Leche Evaporada Descremada 400g', marca: 'Gloria', icono: 'cow', categoria: 'Lácteos' },
  { id_api: 'L03', nombre: 'Leche Evaporada Light 400g', marca: 'Gloria', icono: 'cow', categoria: 'Lácteos' },
  { id_api: 'L04', nombre: 'Leche Fresca UHT Entera 1L', marca: 'Laive', icono: 'bottle-wine-outline', categoria: 'Lácteos' },
  { id_api: 'L05', nombre: 'Yogurt Bebible Fresa 1kg', marca: 'Gloria', icono: 'cup-water', categoria: 'Lácteos' },
  { id_api: 'L06', nombre: 'Yogurt Griego Natural 500g', marca: 'Tottus', icono: 'cup-water', categoria: 'Lácteos' },
  { id_api: 'L07', nombre: 'Mantequilla con Sal 200g', marca: 'Gloria', icono: 'clover', categoria: 'Lácteos' },
  { id_api: 'L08', nombre: 'Queso Edam Tajado 200g', marca: 'Laive', icono: 'cheese', categoria: 'Lácteos' },
  { id_api: 'L09', nombre: 'Mezcla Láctea Reforzada 400g', marca: 'Ideal', icono: 'cow', categoria: 'Lácteos' },
  { id_api: 'L10', nombre: 'Leche Condensada 395g', marca: 'Nestlé', icono: 'cup-water', categoria: 'Lácteos' },

  // ABARROTES (Arroz, Aceite, Fideos, Menestras)
  { id_api: 'A01', nombre: 'Arroz Extra Costeño 1kg', marca: 'Costeño', icono: 'barley', categoria: 'Abarrotes' },
  { id_api: 'A02', nombre: 'Arroz Superior Paisana 1kg', marca: 'Paisana', icono: 'barley', categoria: 'Abarrotes' },
  { id_api: 'A03', nombre: 'Aceite Vegetal Premium 1L', marca: 'Primor', icono: 'oil', categoria: 'Abarrotes' },
  { id_api: 'A04', nombre: 'Aceite de Girasol 1L', marca: 'Cil', icono: 'oil', categoria: 'Abarrotes' },
  { id_api: 'A05', nombre: 'Fideos Canuto Grande 500g', marca: 'Don Vittorio', icono: 'pasta', categoria: 'Abarrotes' },
  { id_api: 'A06', nombre: 'Fideos Spaghetti 500g', marca: 'Molitalia', icono: 'pasta', categoria: 'Abarrotes' },
  { id_api: 'A07', nombre: 'Lenteja de la Sierra 500g', marca: 'Costeño', icono: 'dots-grid', categoria: 'Abarrotes' },
  { id_api: 'A08', nombre: 'Frijol Canario 500g', marca: 'Paisana', icono: 'dots-grid', categoria: 'Abarrotes' },
  { id_api: 'A09', nombre: 'Azúcar Rubia Bolsa 1kg', marca: 'Paramonga', icono: 'shaker-outline', categoria: 'Abarrotes' },
  { id_api: 'A10', nombre: 'Sal de Mesa 1kg', marca: 'Emsal', icono: 'shaker-outline', categoria: 'Abarrotes' },
  { id_api: 'A11', nombre: 'Atún Trozos en Aceite', marca: 'Primor', icono: 'fish', categoria: 'Abarrotes' },
  { id_api: 'A12', nombre: 'Avena precocida 500g', marca: '3 Ositos', icono: 'barley', categoria: 'Abarrotes' },
  { id_api: 'A13', nombre: 'Mayonesa Original 200g', marca: 'Alacena', icono: 'bottle-tonic-outline', categoria: 'Abarrotes' },
  { id_api: 'A14', nombre: 'Salsa de Tomate 200g', marca: 'Pomarola', icono: 'food-apple', categoria: 'Abarrotes' },
  { id_api: 'A15', nombre: 'Harina sin Preparar 1kg', marca: 'Blanca Flor', icono: 'cube-outline', categoria: 'Abarrotes' },

  // BEBIDAS (Inca Kola, Coca Cola, Aguas, Pulps)
  { id_api: 'B01', nombre: 'Gaseosa Inca Kola 2.25L', marca: 'Inca Kola', icono: 'bottle-soda-classic', categoria: 'Bebidas' },
  { id_api: 'B02', nombre: 'Gaseosa Coca Cola Sin Azúcar 2.25L', marca: 'Coca Cola', icono: 'bottle-soda-classic', categoria: 'Bebidas' },
  { id_api: 'B03', nombre: 'Agua Mineral Sin Gas 2.5L', marca: 'Cielo', icono: 'water-outline', categoria: 'Bebidas' },
  { id_api: 'B04', nombre: 'Agua de Manantial 1.5L', marca: 'San Mateo', icono: 'water-outline', categoria: 'Bebidas' },
  { id_api: 'B05', nombre: 'Néctar de Durazno 1L', marca: 'Pulp', icono: 'juice', categoria: 'Bebidas' },
  { id_api: 'B06', nombre: 'Bebida Rehidratante 500ml', marca: 'Sporade', icono: 'lightning-bolt', categoria: 'Bebidas' },
  { id_api: 'B07', nombre: 'Cerveza Pilsen Callao 630ml', marca: 'Backus', icono: 'glass-mug', categoria: 'Bebidas' },
  { id_api: 'B08', nombre: 'Vino Tinto Borgoña 750ml', marca: 'Santiagoirolo', icono: 'bottle-wine', categoria: 'Bebidas' },

  // LIMPIEZA
  { id_api: 'LM01', nombre: 'Detergente Active Care 1kg', marca: 'Bolívar', icono: 'washing-machine', categoria: 'Limpieza' },
  { id_api: 'LM02', nombre: 'Detergente Multiacción 1kg', marca: 'Opal', icono: 'washing-machine', categoria: 'Limpieza' },
  { id_api: 'LM03', nombre: 'Lavavajilla en Crema Limón', marca: 'Ayudín', icono: 'dishwasher', categoria: 'Limpieza' },
  { id_api: 'LM04', nombre: 'Limpiador Multiusos 900ml', marca: 'Poett', icono: 'spray', categoria: 'Limpieza' },
  { id_api: 'LM05', nombre: 'Lejía Tradicional 1L', marca: 'Clorox', icono: 'bottle-tonic-skull', categoria: 'Limpieza' },
  { id_api: 'LM06', nombre: 'Papel Higiénico 4 rollos', marca: 'Elite', icono: 'roll-paper', categoria: 'Limpieza' },
  { id_api: 'LM07', nombre: 'Suavizante para Ropa 1L', marca: 'Suavitel', icono: 'flower-outline', categoria: 'Limpieza' },
  { id_api: 'LM08', nombre: 'Bolsas de Basura Grande', marca: 'Ziploc', icono: 'delete-empty', categoria: 'Limpieza' },

  // SNACKS Y GALLETAS
  { id_api: 'S01', nombre: 'Galletas Soda Paquete x6', marca: 'Field', icono: 'cookie', categoria: 'Snacks' },
  { id_api: 'S02', nombre: 'Galletas Rellenas de Vainilla', marca: 'Casino', icono: 'cookie', categoria: 'Snacks' },
  { id_api: 'S03', nombre: 'Papas Fritas Clásicas', marca: 'Lay\'s', icono: 'popcorn', categoria: 'Snacks' },
  { id_api: 'S04', nombre: 'Tortillas de Maíz Queso', marca: 'Doritos', icono: 'triangle-outline', categoria: 'Snacks' },
  { id_api: 'S05', nombre: 'Chocolate de Leche con Maní', marca: 'Sublime', icono: 'candy', categoria: 'Snacks' },
  { id_api: 'S06', nombre: 'Barra de Cereal Chispas', marca: 'Angel', icono: 'baguette', categoria: 'Snacks' },

  // FRUTAS Y VERDURAS
  { id_api: 'FV01', nombre: 'Plátano de Seda x 1kg', marca: 'Genérico', icono: 'fruit-cherries', categoria: 'Frutas' },
  { id_api: 'FV02', nombre: 'Manzana Delicia x 1kg', marca: 'Genérico', icono: 'food-apple', categoria: 'Frutas' },
  { id_api: 'FV03', nombre: 'Papaya Selva unidad', marca: 'Genérico', icono: 'fruit-watermelon', categoria: 'Frutas' },
  { id_api: 'FV04', nombre: 'Tomate Italiano x 1kg', marca: 'Genérico', icono: 'carrot', categoria: 'Verduras' },
  { id_api: 'FV05', nombre: 'Cebolla Roja x 1kg', marca: 'Genérico', icono: 'carrot', categoria: 'Verduras' },
  { id_api: 'FV06', nombre: 'Papa Canchán x 1kg', marca: 'Genérico', icono: 'pot-steam', categoria: 'Verduras' },
  { id_api: 'FV07', nombre: 'Limón Sutil x 1kg', marca: 'Genérico', icono: 'lemon', categoria: 'Verduras' },
  { id_api: 'FV08', nombre: 'Zanahoria Entera x 1kg', marca: 'Genérico', icono: 'carrot', categoria: 'Verduras' },

  // CARNES Y PESCADOS
  { id_api: 'CP01', nombre: 'Pollo Entero con Menudencia', marca: 'San Fernando', icono: 'food-drumstick', categoria: 'Carnes' },
  { id_api: 'CP02', nombre: 'Pechuga de Pollo 500g', marca: 'Redondos', icono: 'food-drumstick', categoria: 'Carnes' },
  { id_api: 'CP03', nombre: 'Bistec de Res 500g', marca: 'Ganadería', icono: 'food-steak', categoria: 'Carnes' },
  { id_api: 'CP04', nombre: 'Carne Molida Especial 500g', marca: 'Minka', icono: 'food-steak', categoria: 'Carnes' },
  { id_api: 'CP05', nombre: 'Filete de Tilapia 500g', marca: 'Congelados', icono: 'fish', categoria: 'Carnes' },
  { id_api: 'CP06', nombre: 'Huevos Pardos x 12 unidades', marca: 'La Calera', icono: 'egg-variant', categoria: 'Carnes' },
  { id_api: 'CP07', nombre: 'Hot Dog de Pollo x 12', marca: 'Braedt', icono: 'food-hot-dog', categoria: 'Carnes' },
  { id_api: 'CP08', nombre: 'Jamón del País Tajado 200g', marca: 'Zina', icono: 'food-steak', categoria: 'Carnes' },

  // CUIDADO PERSONAL
  { id_api: 'CP10', nombre: 'Shampoo Reparación Total 400ml', marca: 'Elvive', icono: 'bottle-tonic-plus-outline', categoria: 'Personal' },
  { id_api: 'CP11', nombre: 'Jabón de Tocador Cremoso', marca: 'Dove', icono: 'soap', categoria: 'Personal' },
  { id_api: 'CP12', nombre: 'Pasta Dental Triple Acción', marca: 'Colgate', icono: 'toothbrush-paste', categoria: 'Personal' },
  { id_api: 'CP13', nombre: 'Desodorante Aerosol Hombre', marca: 'Rexona', icono: 'spray', categoria: 'Personal' },
];

/**
 * Función generadora optimizada con variedad de iconos temáticos
 */
const generarMasRecursos = () => {
  const adicionales = [];
  const marcasAbarrotes = ['Costeño', 'Paisana', 'Don Vittorio', 'Molitalia', 'Primor', 'Nicolini', 'Bolívar'];
  const tiposFideos = ['Spaghetti', 'Tornillo', 'Codito', 'Cabello de Angel', 'Linguini', 'Canuto', 'Fettuccine'];

  // Generar 100 variaciones de Abarrotes
  for (let i = 1; i <= 100; i++) {
    const marca = marcasAbarrotes[Math.floor(Math.random() * marcasAbarrotes.length)];
    const fideo = tiposFideos[Math.floor(Math.random() * tiposFideos.length)];
    adicionales.push({
      id_api: `GEN-A-${i}`,
      nombre: `Fideos ${fideo} ${marca} ${250 + (i * 10)}g`,
      marca: marca,
      icono: 'pasta',
      categoria: 'Abarrotes'
    });
  }

  // Generar 100 variaciones de Bebidas
  const sabores = ['Fresa', 'Mango', 'Durazno', 'Piña', 'Maracuyá', 'Limón', 'Naranja'];
  for (let i = 1; i <= 100; i++) {
    const sabor = sabores[Math.floor(Math.random() * sabores.length)];
    adicionales.push({
      id_api: `GEN-B-${i}`,
      nombre: `Jugo de ${sabor} Refrescante ${500 + (i * 5)}ml`,
      marca: 'Selva',
      icono: 'bottle-wine-outline',
      categoria: 'Bebidas'
    });
  }

  // Generar 100 variaciones de Snacks
  for (let i = 1; i <= 100; i++) {
    adicionales.push({
      id_api: `GEN-S-${i}`,
      nombre: `Snack Crujiente Sabor Mix ${i}`,
      marca: 'Karinto',
      icono: 'cookie',
      categoria: 'Snacks'
    });
  }

  // Generar 150 variaciones de Limpieza/Hogar
  for (let i = 1; i <= 150; i++) {
    adicionales.push({
      id_api: `GEN-L-${i}`,
      nombre: `Limpiador Perfumado Fragancia ${i}`,
      marca: 'Sapolio',
      icono: 'spray',
      categoria: 'Limpieza'
    });
  }

  return adicionales;
};

export const productosPeru = [...productosPeruBase, ...generarMasRecursos()];
export default productosPeru;