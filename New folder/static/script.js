function checkSSL() {
    var domain = document.getElementById("domain").value;
    if (domain.trim() === "") {
        alert("Please enter a domain.");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/check_ssl", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            displaySSLInfo(response);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            document.getElementById("sslInfo").innerHTML = "<p>Error occurred. Please try again.</p>";
        }
    };
    xhr.send(JSON.stringify({ "domain": domain }));
}

function displaySSLInfo(info) {
    var sslInfoDiv = document.getElementById("sslInfo");
    if (info.hasOwnProperty("Error")) {
        sslInfoDiv.innerHTML = "<p>Error: " + info["Error"] + "</p>";
    } else {
        var html = "<h2>SSL Certificate Information for " + info["Common Name"] + "</h2>";
        html += "<p><strong>Issuer:</strong> " + info["Issuer"] + "</p>";
        html += "<p><strong>Issued On:</strong> " + info["Issued On"] + "</p>";
        html += "<p><strong>Expires On:</strong> " + info["Expires On"] + "</p>";
        html += "<p><strong>Days Until Expiry:</strong> " + info["Days Until Expiry"] + "</p>";
        sslInfoDiv.innerHTML = html;
    }
}
