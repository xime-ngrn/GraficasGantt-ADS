/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package API;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Ximena Noguerón
 */
public class EliminarEjercicio extends HttpServlet {

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
        
    }
    
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        response.setContentType("application/json;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        String idEjercicio = request.getParameter("idEjercicio");
        System.out.println("idEjercicio recibido: [" + idEjercicio + "]");

        try {
            DB bd = new DB();
            bd.setConnection("com.mysql.cj.jdbc.Driver",
                    "jdbc:mysql://localhost/diagramagantt?serverTimezone=UTC");

            String deleteTareas = "DELETE FROM tareas WHERE idEJERCICIO = " + idEjercicio + ";";
            bd.executeUpdate(deleteTareas);

            String deleteEjercicio = "DELETE FROM ejercicios WHERE idEJERCICIO = " + idEjercicio + ";";
            bd.executeUpdate(deleteEjercicio);

            out.println("{\"status\":\"yes\"}");

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"status\":\"error\",\"message\":\"No se pudo eliminar el ejercicio\"}");
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
