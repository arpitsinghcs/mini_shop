* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f7fb;
  color: #1f2937;
}

.auth-body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0f172a;
  color: white;
  padding: 1rem 2rem;
}

.brand {
  font-size: 1.4rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.page-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  padding: 1.25rem;
}

.inner-card {
  margin-top: 1rem;
}

.auth-card {
  width: min(420px, 90vw);
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.12);
}

.auth-card h1 {
  margin-bottom: 0.5rem;
}

.form-card {
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

input, select, textarea, button {
  font: inherit;
}

input, select, textarea {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  background: white;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-secondary {
  background: #e2e8f0;
  color: #111827;
}

.button-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.hint-box {
  margin-top: 1rem;
  background: #ecfdf5;
  border-left: 4px solid #10b981;
  padding: 0.75rem;
  border-radius: 8px;
}

.stat-card {
  text-align: center;
}

.stat-card span {
  color: #64748b;
}

.stat-card h2 {
  font-size: 2rem;
  margin: 0.5rem 0 0;
}

.list-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  padding: 0.75rem;
}

.summary-box {
  margin: 1rem 0;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 10px;
}

.summary-box div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.grand-total {
  font-size: 1.2rem;
  border-top: 1px solid #d1d5db;
  padding-top: 0.75rem;
}

.button-inline {
  justify-content: end;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .nav-links {
    flex-wrap: wrap;
  }
}
