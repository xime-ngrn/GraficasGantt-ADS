/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author eduar
 */

package API;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;

@WebServlet(name = "Registro", urlPatterns = {"/Registro"})
public class Registro extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Evitar caché
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        
        // Configurar respuesta como JSON
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        // Recibir los parámetros desde el Frontend (React)
        String usuario = request.getParameter("user");
        String password = request.getParameter("password");
        // Por defecto, a los usuarios nuevos les daremos el tipo "usuario" 
        String tipo = request.getParameter("tipo") != null ? request.getParameter("tipo") : "usuario";

        try {
            DB bd = new DB();
            bd.setConnection("com.mysql.cj.jdbc.Driver", "jdbc:mysql://localhost/diagramagantt?serverTimezone=UTC");
            
            // 1. Validar si el usuario ya existe en la base de datos
            ResultSet rs = bd.executeQuery("SELECT * FROM login WHERE USERNAME='" + usuario + "';");
            
            if (rs.next()) {
                // Si entra aquí, el nombre de usuario ya está ocupado
                out.println("{\"status\":\"error\", \"message\":\"El usuario ya existe\"}");
            } else {
                // 2. Si no existe, preparamos la consulta para insertarlo
                String sqlInsert = "INSERT INTO login (USERNAME, PASSWORD, TIPOUSUARIO) VALUES ('" + usuario + "', '" + password + "', '" + tipo + "');";
                
                // Usamos executeUpdate porque es una inserción, no una consulta. Devuelve el número de filas afectadas.
                int filasAfectadas = bd.executeUpdate(sqlInsert);
                
                if (filasAfectadas > 0) {
                    out.println("{\"status\":\"yes\", \"message\":\"Cuenta creada exitosamente\"}");
                } else {
                    out.println("{\"status\":\"no\", \"message\":\"No se pudo crear la cuenta\"}");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"status\":\"error\", \"message\":\"Error de conexión al servidor\"}");
        }
    }
}