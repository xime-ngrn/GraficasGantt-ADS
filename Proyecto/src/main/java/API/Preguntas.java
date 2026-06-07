package API;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.ResultSet;

public class Preguntas extends HttpServlet {

    private PrintWriter out;


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        out = response.getWriter();
        response.setContentType("application/json");
        response.addHeader("Access-Control-Allow-Origin", "*");
            StringBuilder json = new StringBuilder();
            json.append("[");            
    try
    {
    DB bd= new DB();
    bd.setConnection("com.mysql.cj.jdbc.Driver", "jdbc:mysql://localhost/crudjson");        
    ResultSet rs=bd.executeQuery("select * from tablajson;");      

    while(rs.next())
    {
    String cadena=rs.getString("columnajson");
    json.append(cadena+",");
    }
    }
    catch(Exception e)
    {
    e.printStackTrace();
    }
    int indice=json.lastIndexOf(",");
    json.deleteCharAt(indice);
    json.append("]");
    System.out.println(json.toString());
    out.write(json.toString());
    }

}
