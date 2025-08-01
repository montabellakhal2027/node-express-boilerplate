terraform {
 required_providers {
  kubernetes = {
  source     = "hashicorp/kubernetes"
  version    = "~> 2.23.0"
}
helm = {
  source  = "hashicorp/helm"
  version = "~> 2.11.0" 
 }
}
}

provider "kubernetes" {
   config_path    = "~/.kube/config"
   config_context = "minikube"
}

provider "helm"{
kubernetes {
  config_path    = "~/.kube/config"
  config_context = "minikube"
 }
}
resource "kubernetes_namespace" "argocd" {
	metadata {
      	  name = "argocd"
	}
}

resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  version    = "5.46.8"
  namespace  = kubernetes_namespace.argocd.metadata[0].name
  timeout    = 600     # 10-minute timeout
  wait       = true    # Wait for resources
  atomic     = true    # Rollback if failed

  set {
    name  = "server.service.type"
    value = "NodePort"
  }

  set {
    name  = "server.ingress.enabled"
    value = "true"
  }

  set {
    name  = "server.ingress.hosts[0]"
    value = "argocd.local"
  }
}

