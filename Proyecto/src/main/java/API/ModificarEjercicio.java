/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package API;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Ximena Noguerón
 */
public class ModificarEjercicio extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();

        String idEjercicio = request.getParameter("idEjercicio");
        String nombreEjercicio = request.getParameter("nombreEjercicio");

        String[] tareaNombre = request.getParameterValues("tareaNombre");
        String[] tareaInicio = request.getParameterValues("tareaInicio");
        String[] tareaFin = request.getParameterValues("tareaFin");
        String[] idTemporal = request.getParameterValues("idTemporal");
        String[] depTemporal = request.getParameterValues("depTemporal");

        try {
            DB bd = new DB();
            bd.setConnection("com.mysql.cj.jdbc.Driver",
                    "jdbc:mysql://localhost/diagramagantt?serverTimezone=UTC");

            String updateEjercicio = "UPDATE ejercicios SET nombre='" + nombreEjercicio
                    + "' WHERE idEJERCICIO=" + idEjercicio + ";";
            bd.executeUpdate(updateEjercicio);

            bd.executeUpdate("UPDATE tareas SET idDependencia = NULL WHERE idEJERCICIO=" + idEjercicio + ";");
            bd.executeUpdate("DELETE FROM tareas WHERE idEJERCICIO=" + idEjercicio + ";");

            HashMap<String, Integer> mapaIds = new HashMap<>();

            if (tareaNombre != null) {

                for (int i = 0; i < tareaNombre.length; i++) {
                    String insertTarea = "INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO, idDependencia) VALUES ('"
                            + tareaNombre[i] + "', '" + tareaInicio[i] + "', '" + tareaFin[i] + "', " + idEjercicio + ", NULL);";
                    bd.executeUpdate(insertTarea);

                    ResultSet rsT = bd.executeQuery("SELECT LAST_INSERT_ID() AS id;");
                    if (rsT.next()) {
                        mapaIds.put(idTemporal[i], rsT.getInt("id"));
                    }
                }

                for (int i = 0; i < tareaNombre.length; i++) {
                    if (depTemporal[i] != null && !depTemporal[i].trim().isEmpty() && !depTemporal[i].equals("null")) {
                        String dependenciaHijo = idTemporal[i];
                        String dependenciaPadre = depTemporal[i];

                        if (mapaIds.containsKey(dependenciaHijo) && mapaIds.containsKey(dependenciaPadre)) {
                            int idRealHijo = mapaIds.get(dependenciaHijo);
                            int idRealPadre = mapaIds.get(dependenciaPadre);

                            String updateDependencia = "UPDATE tareas SET idDependencia = " + idRealPadre
                                    + " WHERE idTAREA = " + idRealHijo + ";";
                            bd.executeUpdate(updateDependencia);
                        }
                    }
                }
            }

            out.write("{\"status\":\"yes\",\"idEjercicio\":" + idEjercicio + "}");

        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"status\":\"error\",\"message\":\"No se pudo actualizar el ejercicio.\"}");
        }
    }

    @Override
    public String getServletInfo() {
        return "Modificar ejercicio";
    }
}