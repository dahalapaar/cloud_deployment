const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const { exec } = require("child_process")
const cors = require("cors")
const path = require("path")

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Function to get Terraform path
async function getTerraformPath() {
  try {
    const { stdout } = await execPromise("which terraform")
    return stdout.trim()
  } catch (error) {
    console.error(
      "Terraform not found in PATH. Please install Terraform and add it to your PATH."
    )
    throw new Error("Terraform not found")
  }
}

// Endpoint to handle form submission
app.post("/submit", async (req, res) => {
  try {
    const data = req.body

    // Dynamically create variables.tf file
    const variablesContent = `
variable "project_name" {
  default = "${data.vmName}"
}

variable "region" {
  default = "${data.region}"
}

variable "vm_size" {
  default = "${data.vmSize}"
}

variable "os_type" {
  default = "${data.osType}"
}

variable "os_version" {
  default = "${data.osVersion}"
}

variable "auth_type" {
  default = "${data.authType}"
}

variable "admin_username" {
  default = "${data.username}"
}

variable "admin_password" {
  default = "${data.password || ""}"
}

variable "ssh_public_key" {
  default = ${data.sshKey ? `"${data.sshKey}"` : "null"}
}

variable "vnet_option" {
  default = "${data.vnetOption}"
}

variable "vnet_name" {
  default = "${data.vnetName || ""}"
}

variable "subnet_option" {
  default = "${data.subnetOption}"
}

variable "subnet_name" {
  default = "${data.subnetName || ""}"
}

variable "public_ip" {
  default = "${data.publicIP}"
}

variable "nsg_option" {
  default = "${data.nsgOption}"
}

variable "nsg_name" {
  default = "${data.nsgName || ""}"
}

variable "inbound_ports" {
  default = ${JSON.stringify(data.inboundPorts)}
}

variable "storage_type" {
  default = "${data.diskType}"
}

variable "disk_size" {
  default = "${data.diskSize}"
}

variable "data_disks" {
  default = "${data.dataDisks}"
}

variable "availability_set" {
  default = "${data.availabilitySet}"
}

variable "tags" {
  default = ${JSON.stringify(parseTags(data.tags))}
}

variable "azure_backup" {
  default = "${data.azureBackup}"
}
`

    // // Write variables.tf to the Terraform directory
    // fs.writeFile("/path/to/terraform/variables.tf", variablesContent, (err) => {
    //   if (err) {
    //     console.error("Error writing variables.tf:", err)
    //     return res.status(500).send("Error generating Terraform file.")
    //   }

    const terraformDir = path.join(__dirname, "terraform")
    const variablesPath = path.join(terraformDir, "variables.tf")

    // Write variables.tf to the Terraform directory
    await fs.writeFile(variablesPath, variablesContent)

    // Azure login
    await execPromise("az login --use-device-code")

    // Set Azure subscription
    await execPromise(
      'az account set --subscription "<Guys update your terraform subscription id>"'
    )

    // Execute Terraform init and apply commands
    const terraformPath = await getTerraformPath()
    const { stdout, stderr } = await execPromise(
      `${terraformPath} -chdir=${terraformDir} init && ${terraformPath} -chdir=${terraformDir} apply -auto-approve`
    )

    if (stderr) {
      console.error(`stderr: ${stderr}`)
    }

    console.log(`stdout: ${stdout}`)
    res.status(200).send("VM creation initiated successfully.")
  } catch (error) {
    console.error(`Error: ${error.message}`)
    res.status(500).send(`Error: ${error.message}`)
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
