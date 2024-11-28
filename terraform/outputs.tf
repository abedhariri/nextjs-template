output "IPv4" {
  value = digitalocean_droplet.server.ipv4_address
}

output "IPv6" {
  value = digitalocean_droplet.server.ipv6_address
}
