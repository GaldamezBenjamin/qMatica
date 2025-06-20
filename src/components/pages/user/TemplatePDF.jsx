import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 40,
    color: "#333",
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "1px solid #eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1px solid #eee",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statCard: {
    width: "48%",
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  userInfoCard: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    marginBottom: 25,
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    width: "48%",
  },
  metaText: {
    fontSize: 10,
    color: "#666",
    marginBottom: 3,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 15,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#333",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: "1px solid #eee",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    textAlign: "center",
    color: "#999",
    paddingTop: 10,
    borderTop: "1px solid #eee",
  },
  watermark: {
    position: 'absolute',
    opacity: 0.05,
    fontSize: 64,
    color: '#999',
    bottom: '50%',
  },
});

const MyDocument = ({ data, isSubscribed = false }) => {
  const currentDate = format(new Date(), "PPPP", { locale: es });
  
  // Limitar a 3 categorías para no suscriptores
  const categoriasMostrar = isSubscribed 
    ? data.stats.categoriasIncorrectas 
    : (data.stats.categoriasIncorrectas || []).slice(0, 3);

  return (
    <Document>
      {/* Primera página */}
      <Page size="A4" style={styles.page}>
        {!isSubscribed && (
          <View style={styles.watermark}>
            <Text>Versión Gratuita</Text>
          </View>
        )}

        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>qMática: Reporte de Estadísticas</Text>
          <Text style={styles.subtitle}>
            {isSubscribed ? 'Versión Completa' : 'Versión Gratuita'} • Generado el {currentDate}
          </Text>
        </View>

        {/* Información del usuario con fondo */}
        <View style={styles.userInfoCard}>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.metaText}>Nombre:</Text>
              <Text style={{ fontSize: 14, marginBottom: 10 }}>{data.username}</Text>
              
              <Text style={styles.metaText}>Correo:</Text>
              <Text style={{ fontSize: 12, marginBottom: 10 }}>{data.email}</Text>
            </View>
            
            <View style={styles.column}>
              <Text style={styles.metaText}>Rango actual:</Text>
              <Text style={{ fontSize: 14, marginBottom: 10 }}>{data.exp.rango}</Text>
              
              <Text style={styles.metaText}>EXP acumulado:</Text>
              <Text style={{ fontSize: 12 }}>{data.exp.actual} EXP</Text>
            </View>
          </View>
        </View>

        {/* Estadísticas principales */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Rendimiento</Text>
          
          <View style={styles.grid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Quizzes completados</Text>
              <Text style={styles.statValue}>{data.stats.quizzesCompleted}</Text>
            </View>
            
            {isSubscribed && (
              <>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Tiempo total invertido</Text>
                  <Text style={styles.statValue}>{data.stats.totalTiempo}</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Último quiz completado</Text>
                  <Text style={styles.statValue}>{data.stats.ultimaActualizacion}</Text>
                </View>
              </>
            )}
            
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Respuestas correctas</Text>
              <Text style={styles.statValue}>{data.stats.totalCorrectas}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Respuestas incorrectas</Text>
              <Text style={styles.statValue}>{data.stats.totalIncorrectas}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Tiempo promedio</Text>
              <Text style={styles.statValue}>{data.stats.tiempoPromedio}</Text>
            </View>
          </View>
        </View>

        {/* Progreso */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Progreso</Text>
          
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.metaText}>Progreso hacia {data.exp.siguienteRango}: {data.exp.progreso}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${data.exp.progreso}%` }]} />
            </View>
          </View>
          
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.metaText}>EXP actual</Text>
              <Text>{data.exp.actual} EXP</Text>
            </View>
            
            <View style={styles.column}>
              <Text style={styles.metaText}>EXP requerido</Text>
              <Text>{data.exp.expRequerida} EXP</Text>
            </View>
          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>Reporte generado automáticamente por qMática • {currentDate}</Text>
          {!isSubscribed && (
            <Text style={{ marginTop: 5 }}>Suscríbete para acceder a estadísticas completas</Text>
          )}
        </View>
      </Page>

      {/* Segunda página - Áreas de mejora (solo si hay categorías) */}
      {categoriasMostrar?.length > 0 && (
        <Page size="A4" style={styles.page}>
          {!isSubscribed && (
            <View style={styles.watermark}>
              <Text>Versión Gratuita</Text>
            </View>
          )}

          <View style={styles.header}>
            <Text style={styles.title}>
              Áreas de mejora {!isSubscribed && '(Top 3)'}
            </Text>
            <Text style={styles.subtitle}>qMática • {currentDate}</Text>
          </View>
          
          <View style={styles.section}>
            {categoriasMostrar.map((cat, index) => (
              <View key={index} style={styles.categoryItem}>
                <Text>{cat.nombre || `Categoría ${index + 1}`}</Text>
                <Text>{cat.incorrectas} incorrectas</Text>
              </View>
            ))}

            {!isSubscribed && categoriasMostrar.length === 3 && (
              <Text style={{ fontSize: 10, color: '#666', marginTop: 15, textAlign: 'center' }}>
                Suscríbete para ver todas tus áreas de mejora
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            <Text>Reporte generado automáticamente por qMática • {currentDate}</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default MyDocument;