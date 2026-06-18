package API;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.ResultSet;

public class Ejercicios extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.addHeader("Access-Control-Allow-Origin", "*");
        
        PrintWriter out = response.getWriter();
        
        StringBuilder json = new StringBuilder();
        json.append("[");            
        
        try {
            DB bd = new DB();
            bd.setConnection("com.mysql.cj.jdbc.Driver",
                    "jdbc:mysql://localhost/diagramagantt?serverTimezone=UTC");
            ResultSet rs = bd.executeQuery("select * from ejercicios;");      

            boolean primero = true;
            while (rs.next()) {
                if (!primero) {
                    json.append(",");
                }
                
                // Extraemos las columnas reales de tu tabla
                int idEjercicio = rs.getInt("idEJERCICIO");
                String nombre = rs.getString("nombre");
                
                // Construimos el objeto JSON manualmente con las propiedades correctas
                json.append("{");
                json.append("\"idEJERCICIO\":").append(idEjercicio).append(",");
                json.append("\"nombre\":\"").append(nombre).append("\"");
                json.append("}");
                
                primero = false;
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        
        json.append("]");
        
        System.out.println("json ejercicios: " + json.toString());
        out.write(json.toString());
    }
}