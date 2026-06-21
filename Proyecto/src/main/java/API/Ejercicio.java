package API;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Ejercicio extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.addHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();
        String id = request.getParameter("id");

        try {
            DB bd = new DB();
            bd.setConnection("com.mysql.cj.jdbc.Driver",
                    "jdbc:mysql://localhost/diagramagantt?serverTimezone=UTC");

            ResultSet rsEjercicio =
                bd.executeQuery("SELECT * FROM ejercicios WHERE idEJERCICIO=" + id);

            // Si el ejercicio no existe, devolvemos un JSON válido (no rompemos al frontend).
            if (!rsEjercicio.next()) {
                out.write("{\"status\":\"no\",\"message\":\"Ejercicio no encontrado\"}");
                return;
            }

            StringBuilder json = new StringBuilder();
            json.append("{");
            json.append("\"idEJERCICIO\":").append(rsEjercicio.getInt("idEJERCICIO")).append(",");
            json.append("\"nombre\":\"").append(rsEjercicio.getString("nombre")).append("\",");
            json.append("\"tareas\":[");

            ResultSet rsTareas =
                bd.executeQuery("SELECT * FROM tareas WHERE idEJERCICIO=" + id);

            boolean primero = true;
            while (rsTareas.next()) {
                if (!primero) json.append(",");

                json.append("{");
                json.append("\"idTAREA\":").append(rsTareas.getInt("idTAREA")).append(",");
                json.append("\"nombre\":\"").append(rsTareas.getString("nombre")).append("\",");
                json.append("\"fecha_inicio\":\"").append(rsTareas.getString("fecha_inicio")).append("\",");
                json.append("\"fecha_terminacion\":\"").append(rsTareas.getString("fecha_terminacion")).append("\",");

                int pred = rsTareas.getInt("idDependencia");
                if (rsTareas.wasNull()) {
                    json.append("\"idDependencia\":null");
                } else {
                    json.append("\"idDependencia\":").append(pred);
                }

                json.append("}");
                primero = false;
            }

            json.append("]}");
            out.write(json.toString());

        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"status\":\"error\"}");
        }
    }
}