import ssl
import socket
from datetime import datetime

def ssl_checker(domain):
    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443)) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                issuer = dict(x[0] for x in cert['issuer'])
                subject = dict(x[0] for x in cert['subject'])
                common_name = subject.get('commonName')
                issued_on = datetime.strptime(cert['notBefore'], "%b %d %H:%M:%S %Y %Z")
                expires_on = datetime.strptime(cert['notAfter'], "%b %d %H:%M:%S %Y %Z")
                days_until_expiry = (expires_on - datetime.now()).days
                return {
                    "Common Name": common_name,
                    "Issuer": issuer.get('organizationName', ''),
                    "Issued On": issued_on.strftime("%Y-%m-%d %H:%M:%S"),
                    "Expires On": expires_on.strftime("%Y-%m-%d %H:%M:%S"),
                    "Days Until Expiry": days_until_expiry
                }
    except Exception as e:
        return {"Error": str(e)}

# Example usage:
domain = "example.com"
result = ssl_checker(domain)
if "Error" in result:
    print("Error:", result["Error"])
else:
    print("SSL Certificate Information for", domain)
    for key, value in result.items():
        print(key + ":", value)
