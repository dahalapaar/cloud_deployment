import React, { useState } from "react"
import axios from "axios"
import "./QuestionnaireForm.css"

const QuestionnaireForm = () => {
  const [formData, setFormData] = useState({
    vmName: "",
    region: "",
    vmSize: "",
    osType: "",
    osVersion: "",
    authType: "",
    sshKey: "",
    vnetOption: "",
    vnetName: "",
    subnetOption: "",
    subnetName: "",
    publicIP: "",
    nsgOption: "",
    nsgName: "",
    inboundPorts: [],
    diskType: "",
    diskSize: "",
    dataDisks: "",
    availabilitySet: "",
    tags: "",
    azureBackup: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePortChange = (e) => {
    const { value, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      inboundPorts: checked
        ? [...prevData.inboundPorts, value]
        : prevData.inboundPorts.filter((port) => port !== value),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:5000/submit",
        formData
      )
      alert("Form submitted! VM creation initiated.")
    } catch (error) {
      console.error("Error submitting form", error)
      alert("Error initiating VM creation.")
    }
    console.log("Form Submitted:", formData)
    // Send formData to your backend for Azure VM creation
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Azure Virtual Machine</h1>

      <label>VM Name:</label>
      <input type="text" name="vmName" onChange={handleChange} />

      <label>Region:</label>
      <select name="region" onChange={handleChange}>
        <option value="East US">East US</option>
        <option value="West Europe">West Europe</option>
        <option value="Southeast Asia">Southeast Asia</option>
      </select>

      <label>VM Size:</label>
      <select name="vmSize" onChange={handleChange}>
        <option value="Standard_B1s">Standard_B1s</option>
        <option value="Standard_D2s_v3">Standard_D2s_v3</option>
        <option value="Standard_F2s_v2">Standard_F2s_v2</option>
      </select>

      <label>Operating System:</label>
      <select name="osType" onChange={handleChange}>
        <option value="Windows Server">Windows Server</option>
        <option value="Ubuntu">Ubuntu</option>
        <option value="CentOS">CentOS</option>
        <option value="Red Hat Enterprise Linux">
          Red Hat Enterprise Linux
        </option>
        <option value="Other">Other</option>
      </select>

      <label>OS Version:</label>
      <input type="text" name="osVersion" onChange={handleChange} />

      <label>Virtual Network:</label>
      <select name="vnetOption" onChange={handleChange}>
        <option value="Create New">Create a new virtual network</option>
        <option value="Existing">Use an existing virtual network</option>
      </select>

      {formData.vnetOption === "Existing" && (
        <>
          <label>VNet Name:</label>
          <input type="text" name="vnetName" onChange={handleChange} />
        </>
      )}

      <label>Subnet:</label>
      <select name="subnetOption" onChange={handleChange}>
        <option value="Create New">Create a new subnet</option>
        <option value="Existing">Use an existing subnet</option>
      </select>

      {formData.subnetOption === "Existing" && (
        <>
          <label>Subnet Name:</label>
          <input type="text" name="subnetName" onChange={handleChange} />
        </>
      )}

      <label>Public IP Address:</label>
      <select name="publicIP" onChange={handleChange}>
        <option value="Yes">Yes, create a new public IP address</option>
        <option value="No">No, use a private IP address only</option>
      </select>

      <label>Network Security Group (NSG):</label>
      <select name="nsgOption" onChange={handleChange}>
        <option value="Create New">Create a new security group</option>
        <option value="Existing">Use an existing security group</option>
      </select>

      {formData.nsgOption === "Existing" && (
        <>
          <label>NSG Name:</label>
          <input type="text" name="nsgName" onChange={handleChange} />
        </>
      )}

      <label>Open Inbound Ports:</label>
      <div>
        <label>
          <input type="checkbox" value="HTTP" onChange={handlePortChange} />
          HTTP (80)
        </label>
        <label>
          <input type="checkbox" value="HTTPS" onChange={handlePortChange} />
          HTTPS (443)
        </label>
        <label>
          <input type="checkbox" value="SSH" onChange={handlePortChange} />
          SSH (22, for Linux)
        </label>
        <label>
          <input type="checkbox" value="RDP" onChange={handlePortChange} />
          RDP (3389, for Windows)
        </label>
      </div>

      <label>Disk Type:</label>
      <select name="diskType" onChange={handleChange}>
        <option value="Standard HDD">Standard HDD</option>
        <option value="Standard SSD">Standard SSD</option>
        <option value="Premium SSD">Premium SSD</option>
      </select>

      <label>Disk Size (in GB):</label>
      <input type="number" name="diskSize" onChange={handleChange} />

      <label>Data Disks:</label>
      <input
        type="text"
        name="dataDisks"
        onChange={handleChange}
        placeholder="How many and what size (e.g., 2 x 500GB)"
      />

      <label>Availability Set:</label>
      <select name="availabilitySet" onChange={handleChange}>
        <option value="Yes">Yes, create a new availability set</option>
        <option value="No">No, don't use an availability set</option>
      </select>

      <label>Tags (key=value pairs):</label>
      <input
        type="text"
        name="tags"
        onChange={handleChange}
        placeholder="e.g., Environment=Production, Department=IT"
      />

      <label>Azure Backup:</label>
      <select name="azureBackup" onChange={handleChange}>
        <option value="Enable">Enable Azure Backup</option>
        <option value="Disable">Don't enable Azure Backup</option>
      </select>

      <button type="submit">Create VM</button>
    </form>
  )
}

export default QuestionnaireForm
