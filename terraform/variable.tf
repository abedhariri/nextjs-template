# ####

# Current Available Datacenter Regions

# As of 28-05-2017

#

variable "project_name" {
  type        = string
  description = "The name of the DigitalOcean project."
}

variable "droplet_name" {
  type        = string
  default     = "server"
  description = "The name of the DigitalOcean droplet."
}

variable "do_ams3" {
  description = "Digital Ocean Amsterdam Data Center 3"
  default     = "ams3"
}

# Default Os

variable "ubuntu" {
  description = "Default LTS"
  default     = "ubuntu-24-04-x64"
}

variable "ssh_key" {
  type = string
  default = "personal_pc"
  description = "What is the name of the ssh key"
}

variable "db_password" {
  type = string
  description = "Choose a strong password for your postgres database"
}

variable "domain" {
  type = string
  description = "The domain you would like your application to have -- example \"example.com\""
}

variable "email" {
  type = string
  default = "abedharirii@gmail.com"
  description = "The email that is bounded to the domain ssl"
}