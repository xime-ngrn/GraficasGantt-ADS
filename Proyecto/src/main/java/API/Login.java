package API;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Login extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        String usuario = request.getParameter("user");
        String password = request.getParameter("password");

        try {
            DB bd = new DB();
            bd.setConnection("com.mysql.cj.jdbc.Driver",
                    "jdbc:mysql://localhost/diagramagantt?serverTimezone=UTC");
            ResultSet rs = bd.executeQuery(
                    "select * from login where USERNAME='" + usuario + "' and PASSWORD='" + password + "';");

            if (rs.next()) {
                out.println("{\"status\":\"yes\",\"tipo\":\"" + rs.getString("tipousuario") + "\"}");
            } else {
                out.println("{\"status\":\"no\",\"tipo\":\"nodefinido\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"status\":\"error\",\"tipo\":\"nodefinido\"}");
        }
    }
}