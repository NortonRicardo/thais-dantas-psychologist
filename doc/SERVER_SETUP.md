# Setup do Servidor de Produção — LEMM

**Data:** 2026-05-16  
**Servidor:** Contabo Cloud VPS — `185.111.156.155`  
**OS:** Ubuntu 24.04 LTS  
**Painel:** Coolify 4.0.0 em `https://painel.lemm.com.br`

---

## Índice

1. [Acesso Inicial e Atualização](#1-acesso-inicial-e-atualização)
2. [Usuário não-root](#2-usuário-não-root)
3. [Chave SSH](#3-chave-ssh)
4. [Hardening do SSH](#4-hardening-do-ssh)
5. [Firewall UFW](#5-firewall-ufw)
6. [Firewall Contabo](#6-firewall-contabo)
7. [Fail2ban](#7-fail2ban)
8. [Instalação do Coolify](#8-instalação-do-coolify)
9. [Configuração do Coolify](#9-configuração-do-coolify)
10. [DNS e Domínio](#10-dns-e-domínio)
11. [GitHub App](#11-github-app)
12. [Deploy da Aplicação](#12-deploy-da-aplicação)
13. [Pós-deploy](#13-pós-deploy)
14. [Pendências](#14-pendências)
15. [Portas Abertas](#15-portas-abertas)
16. [Checklist de Segurança](#16-checklist-de-segurança)

---

## 1. Acesso Inicial e Atualização

```bash
ssh root@185.111.156.155

apt update && apt upgrade -y && apt autoremove -y
```

---

## 2. Usuário não-root

```bash
adduser deploy
# preenche senha forte — guarda no 1Password/Bitwarden
# pressiona Enter em todos os campos de informação

usermod -aG sudo deploy
```

> `usermod -aG sudo deploy` adiciona o usuário ao grupo `sudo`, permitindo executar comandos como root via `sudo comando`.

---

## 3. Chave SSH

**No Mac (nova aba):**

```bash
# Gera a chave (pula se já tiver ~/.ssh/id_ed25519)
ssh-keygen -t ed25519 -C "lemm-contabo"

# Copia para o servidor
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@185.111.156.155
```

**Testa o login antes de continuar:**

```bash
ssh deploy@185.111.156.155
# deve entrar sem pedir senha
exit
```

**Atalho no Mac** (`~/.ssh/config`):

```
Host lemm
    HostName 185.111.156.155
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
```

Após configurar, acessa com apenas `ssh lemm`.

---

## 4. Hardening do SSH

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sudo nano /etc/ssh/sshd_config
```

Alterações aplicadas:

```
Port 2222
PermitRootLogin yes          # manter até ter segundo PC com chave SSH
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no             # desabilita redirecionamento gráfico (desnecessário)
```

> **Pendente:** quando tiver segundo PC com chave SSH cadastrada, alterar para:
> ```
> PermitRootLogin no
> PasswordAuthentication no
> ```

```bash
sudo systemctl daemon-reload
sudo systemctl restart ssh.socket
```

**Testa na nova porta antes de fechar a sessão:**

```bash
ssh -p 2222 deploy@185.111.156.155
```

> A partir daqui o SSH é sempre com `-p 2222`.

---

## 5. Firewall UFW

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp    # SSH
sudo ufw allow 80/tcp      # HTTP (Let's Encrypt)
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable            # digita "y"
sudo ufw status verbose
```

Estado final:

```
To           Action    From
--           ------    ----
2222/tcp     ALLOW IN  Anywhere
80/tcp       ALLOW IN  Anywhere
443/tcp      ALLOW IN  Anywhere
```

---

## 6. Firewall Contabo

No painel `my.contabo.com` → seu VPS → aba **Firewall** → **Gerenciar Firewall desta Instância**.

Criado firewall **"Firewall de produção do servidor LEMM."** com as regras:

| Nome | Ação | Protocolo | Porta |
|------|------|-----------|-------|
| SSH | ACCEPT | TCP | 2222 |
| HTTP | ACCEPT | TCP | 80 |
| HTTPS | ACCEPT | TCP | 443 |
| Block all traffic | DROP | Qualquer | Qualquer |

> Segunda camada de proteção na borda da rede da Contabo — bloqueia antes de chegar ao servidor.

---

## 7. Fail2ban

```bash
sudo apt install fail2ban -y

sudo tee /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled  = true
port     = 2222
logpath  = %(sshd_log)s
backend  = %(sshd_backend)s
EOF

sudo systemctl enable fail2ban
sudo systemctl restart fail2ban
sudo systemctl status fail2ban
```

> Bane IPs que tentam 5 logins errados em 10 minutos, por 1 hora.

---

## 8. Instalação do Coolify

```bash
sudo bash -c "curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash"
```

Aguarda ~5 min. O Coolify instala automaticamente:
- Docker 29.5.0
- Traefik v3.6 (proxy reverso + SSL)
- PostgreSQL 15 (banco interno do Coolify)
- Redis 7

---

## 9. Configuração do Coolify

### 9.1 Acesso inicial

Acessa temporariamente via `http://185.111.156.155:8000` e cria a conta admin (só funciona uma vez).

### 9.2 Servidor localhost

**Servers → localhost → Configuration:**
- SSH Port: `2222`

**Servers → localhost → Proxy:**
- Clica **Start** para iniciar o Traefik

### 9.3 Domínio do painel

**Settings → Configuration → General:**
- URL: `https://painel.lemm.com.br`
- Salva

O Traefik provisiona o SSL via Let's Encrypt automaticamente.

### 9.4 Fecha porta 8000

Após `https://painel.lemm.com.br` funcionar com SSL:

```bash
sudo ufw delete allow 8000/tcp
sudo ufw reload
```

Remove também no firewall da Contabo a regra temporária da porta 8000.

---

## 10. DNS e Domínio

### GoDaddy (registrador atual)

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ | 185.111.156.155 | 600s |
| A | www | 185.111.156.155 | 600s |
| A | painel | 185.111.156.155 | 600s |

> `painel.lemm.com.br` — DNS direto (sem proxy) para o Let's Encrypt funcionar.

**Pendente:** configurar redirect `www.lemm.com.br` → `https://lemm.com.br` (301) no GoDaddy Forwarding.

### Verificação

```bash
dig lemm.com.br
dig painel.lemm.com.br
```

---

## 11. GitHub App

**Settings → Source Control → New GitHub App:**

- Name: `coolify-lemm`
- Organization: `iada-lab`
- System Wide: desabilitado
- Custom Git Port: `22`

Após criação, no GitHub:
- `github.com/organizations/iada-lab/settings/installations`
- Configure → Repository access → **Only select repositories** → `LEMM`

---

## 12. Deploy da Aplicação

No painel Coolify:
1. **New Project** → nome `lemm`
2. **New Resource → Dockerfile** (ou Docker Compose)
3. Conecta `iada-lab/LEMM` via GitHub App
4. Adiciona variáveis de ambiente:

```
DATABASE_URL=postgres://postgres:<senha>@<host>:5432/postgres
BETTER_AUTH_SECRET=<openssl rand -hex 32>
BETTER_AUTH_URL=https://lemm.com.br
BETTER_AUTH_BASE_URL=http://localhost:3020
ADMIN_USERNAME=<usuario>
ADMIN_PASSWORD=<senha-forte>
```

5. Em **Domains**: `https://lemm.com.br`
6. **Deploy**

---

## 13. Pós-deploy

### Rodar migrations e seed

```bash
# Descobre o container ID
sudo docker ps

# Roda seed (cria admin + dados iniciais)
sudo docker exec -it <container_id> bun db:seed
```

### Verificar logs

```bash
sudo docker logs <container_id> --tail 50 -f
```

---

## 14. Pendências

| Item | Prioridade | Quando |
|------|-----------|--------|
| Desabilitar senha SSH (`PasswordAuthentication no`) | Alta | Quando tiver segundo PC com chave SSH |
| Bloquear root SSH (`PermitRootLogin no`) | Alta | Junto com item acima |
| Configurar VNC na Contabo | Média | Acesso de emergência |
| Redirect www → apex no GoDaddy | Média | Agora |
| Migrar DNS para Cloudflare | Baixa | WAF + DDoS protection gratuitos |
| Backup automático do banco | Média | Configurar em Settings → Backup no Coolify |
| Snapshot automático Contabo | Baixa | Pago — configurar em Auto Backup no painel |

### Como desabilitar senha SSH (quando tiver segundo PC)

```bash
# 1. Copia chave do novo PC
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@185.111.156.155 -p 2222

# 2. Testa que o novo PC consegue entrar
ssh -p 2222 deploy@185.111.156.155

# 3. Edita o sshd_config
sudo nano /etc/ssh/sshd_config
# Altera:
# PermitRootLogin no
# PasswordAuthentication no

sudo systemctl daemon-reload
sudo systemctl restart ssh.socket
```

---

## 15. Portas Abertas

| Porta | Protocolo | Finalidade | Estado |
|-------|-----------|-----------|--------|
| 2222 | TCP | SSH | ✅ Aberta |
| 80 | TCP | HTTP / Let's Encrypt | ✅ Aberta |
| 443 | TCP | HTTPS | ✅ Aberta |
| 8000 | TCP | Coolify panel | ❌ Fechada |

---

## 16. Checklist de Segurança

### Servidor
- [x] Usuário não-root `deploy` com sudo
- [x] Chave SSH configurada
- [x] SSH na porta 2222
- [x] `MaxAuthTries 3`
- [x] `X11Forwarding no`
- [x] UFW ativo — deny por padrão
- [x] Firewall Contabo — segunda camada
- [x] Fail2ban — bane IPs com força bruta
- [ ] `PermitRootLogin no` — pendente segundo PC
- [ ] `PasswordAuthentication no` — pendente segundo PC

### Coolify
- [x] Painel acessível só via `https://painel.lemm.com.br`
- [x] Porta 8000 fechada
- [x] Traefik com SSL/TLS automático
- [x] SSH port configurado (2222)
- [x] Registro público bloqueado automaticamente
- [x] GitHub App restrito ao repositório `LEMM`

### Aplicação
- [x] Validação Zod em todos os endpoints
- [x] UUID validado em todos os parâmetros `[id]`
- [x] Magic bytes em uploads (JPEG, PNG, PDF)
- [x] Better Auth com rate limit
- [x] Cookies `__Host-` com `sameSite: strict`
- [x] `BETTER_AUTH_BASE_URL` separado do URL público (fix SSL interno)
- [x] `trustedOrigins` com www incluído
- [x] `proxy.ts` usando `BETTER_AUTH_BASE_URL` para fetch interno
