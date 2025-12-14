# **E-COMMERCE PROJECT SETUP**

Group Members: \[Mahad, Sarfaraz, Talha\]  
Project Type: .NET 9 Web API \+ React Frontend \+ SQL Server  
Extra Credit: Kubernetes High Availability (HA) Implementation included.

## **1\. PREREQUISITES (Assumed on Laptop)**

* **Docker Desktop** (Running, with "Enable Kubernetes" CHECKED in Settings).  
* **Visual Studio Code** (VS Code).  
* **SQL Server Management Studio (SSMS)** or Azure Data Studio.  
* **.NET 9 SDK** and **Node.js** (Optional, if running locally without Docker).

## **2\. AUTOMATED SETUP (The "1-Click" Deployment)**

We have provided a batch script to automate building Docker images, deploying to Kubernetes, and opening necessary connection tunnels.

1. Open the project folder in **VS Code**.  
2. Right-click deploy.bat and select **"Run as Administrator"** (or run from Terminal).  
3. **What the script does:**  
   * Builds Docker images for Backend and Frontend.  
   * Applies Kubernetes YAML manifests.  
   * **Automatically opens 3 new terminal windows** for Port Forwarding (Database, Backend, Frontend).  
   * **Do not close these 3 windows.** They keep the app connected.  
4. Verify Pods:  
   In the main terminal, run: kubectl get pods  
   Wait until mssql-deployment, backend-deployment, and frontend-deployment are all Running.

## **3\. DATABASE INITIALIZATION**

Now that the tunnel is open on Port 1433:

1. Open **SSMS** or **Azure Data Studio**.  
2. **Connect:**  
   * **Server:** 127.0.0.1,1433  
   * **Authentication:** SQL Login  
   * **User:** sa  
   * **Password:** Str0ng!Pass123 
   * **Trust Server Certificate:** True (Checked)  
3. **Run Script:**  
   * Open MasterScript-(1).sql from the project folder.  
   * Click **Execute**.  
   * *Wait approx. 5 minutes for 1 Million Rows to generate.*

## **4\. DEMONSTRATION**

### **A. Phase 3 Functionality**

1. Open Browser: http://localhost:3000  
2. **Login:** Use user1@test.com (or Register a new user).  
3. **View Products:** Verify products load (this proves Backend connection).  
4. **Place Order:** Select product, enter quantity, click Buy.  
   * *Backend Logic:* Uses Factory Pattern to select Repository (LINQ/SP).  
   * *Database Logic:* Trigger updates stock automatically.  
5. **View Reports:** Click "Reports" to see SQL View data.

### **B. Extra Credit (High Availability Failover)**

1. Keep the app open in the browser.  
2. Open a Terminal and check the database pod name:  
   kubectl get pods  
3. **KILL THE DATABASE:**  
   kubectl delete pod \[mssql-deployment-name\]

4. Watch Recovery:  
   Run kubectl get pods \-w.  
   * Observation: The old pod terminates. A **NEW** pod immediately starts (ContainerCreating \-\> Running).  
   * *Explanation:* Kubernetes deployment controller ensures HA by replacing the failed node.  
5. **Verify Data Persistence:**  
   * Wait for the new pod to be Running.  
   * Refresh the React App (http://localhost:3000).  
   * **Result:** You can still log in and view orders. Data was NOT lost because it was saved to the Persistent Volume (hostPath).

## **5\. TROUBLESHOOTING**

* **Error:** ERR\_CONNECTION\_REFUSED in Browser.  
  * **Fix:** Ensure the "Backend Port Forward" terminal window is open and running.  
* **Error:** SQL Connection Error 40/10061.  
  * **Fix:** Ensure the "Database Port Forward" terminal window is open and running.  
* **Error:** CrashLoopBackOff on MSSQL Pod.  
  * **Fix:** Increase Docker Desktop Memory limit to 4GB+.