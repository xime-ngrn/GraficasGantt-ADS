/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package API;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Ximena Noguerón
 */
public class ModificarEjercicio extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
protected void doPost(HttpServletRequest request,
        HttpServletResponse response)
        throws ServletException, IOException {

    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    PrintWriter out = response.getWriter();

    String idEjercicio =
            request.getParameter("idEjercicio");

    String nombreEjercicio =
            request.getParameter("nombreEjercicio");

    String[] idTarea =
            request.getParameterValues("idTarea");

    String[] tareaNombre =
            request.getParameterValues("tareaNombre");

    String[] tareaInicio =
            request.getParameterValues("tareaInicio");

    String[] tareaFin =
            request.getParameterValues("tareaFin");

    try {

        DB bd = new DB();

        bd.setConnection(
            "com.mysql.cj.jdbc.Driver",
            "jdbc:mysql://localhost/diagramagantt?serverTimezone=UTC"
        );

        String updateEjercicio =
            "UPDATE ejercicios " +
            "SET nombre='" + nombreEjercicio + "' " +
            "WHERE idEJERCICIO=" + idEjercicio;

        bd.executeUpdate(updateEjercicio);

        if (idTarea != null) {

            for (int i = 0; i < idTarea.length; i++) {

                String updateTarea =
                    "UPDATE tareas SET " +
                    "nombre='" + tareaNombre[i] + "', " +
                    "fecha_inicio='" + tareaInicio[i] + "', " +
                    "fecha_terminacion='" + tareaFin[i] + "' " +
                    "WHERE idTAREA=" + idTarea[i];

                bd.executeUpdate(updateTarea);
            }
        }

        out.write("{\"status\":\"yes\"}");

    } catch (Exception e) {

        e.printStackTrace();

        out.write(
            "{\"status\":\"error\",\"message\":\"No se pudo actualizar\"}"
        );
    }
}

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
