const canvas = document.getElementById('canvas3d');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.z = Math.random() * 1000;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.speedZ = Math.random() * 2 + 1;
  }

  update() {
    this.z -= this.speedZ;
    if (this.z <= 0) {
      this.z = 1000;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    const scale = 1000 / (1000 + this.z);
    const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
    const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
    const size2d = this.size * scale;

    const opacity = 1 - this.z / 1000;

    ctx.beginPath();
    ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(14, 165, 233, ${opacity * 0.6})`;
    ctx.fill();

    const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size2d * 3);
    gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity * 0.2})`);
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x2d, y2d, size2d * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ConnectionLine {
  constructor() {
    this.x1 = Math.random() * canvas.width;
    this.y1 = Math.random() * canvas.height;
    this.x2 = Math.random() * canvas.width;
    this.y2 = Math.random() * canvas.height;
    this.speed = Math.random() * 0.5 + 0.2;
    this.angle = Math.random() * Math.PI * 2;
  }

  update() {
    this.angle += 0.01;
    this.x1 += Math.cos(this.angle) * this.speed;
    this.y1 += Math.sin(this.angle) * this.speed;
    this.x2 += Math.cos(this.angle + Math.PI) * this.speed;
    this.y2 += Math.sin(this.angle + Math.PI) * this.speed;

    if (this.x1 < 0 || this.x1 > canvas.width) this.x1 = Math.random() * canvas.width;
    if (this.y1 < 0 || this.y1 > canvas.height) this.y1 = Math.random() * canvas.height;
    if (this.x2 < 0 || this.x2 > canvas.width) this.x2 = Math.random() * canvas.width;
    if (this.y2 < 0 || this.y2 > canvas.height) this.y2 = Math.random() * canvas.height;
  }

  draw() {
    const gradient = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.1)');
    gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0.1)');

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

const particles = Array.from({ length: 80 }, () => new Particle());
const lines = Array.from({ length: 15 }, () => new ConnectionLine());

function animate() {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  lines.forEach(line => {
    line.update();
    line.draw();
  });

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  particles.forEach((particle, index) => {
    const dx = mouseX - particle.x;
    const dy = mouseY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 150) {
      const force = (150 - distance) / 150;
      particle.speedX += (dx / distance) * force * 0.1;
      particle.speedY += (dy / distance) * force * 0.1;
    }
  });
});

const cards = document.querySelectorAll('.card-3d');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
});

const inputs = document.querySelectorAll('.input-3d');
inputs.forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.style.transform = 'translateZ(10px)';
  });

  input.addEventListener('blur', function() {
    this.parentElement.style.transform = 'translateZ(0px)';
  });
});

document.querySelectorAll('.btn-3d').forEach(button => {
  button.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px) translateZ(10px) scale(1.02)';
  });

  button.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) translateZ(0px) scale(1)';
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1
});

cards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(50px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});
