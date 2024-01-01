using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace EvaluationProject.Models
{
    public partial class EvaluationContext : DbContext
    {
        public EvaluationContext()
        {
        }

        public EvaluationContext(DbContextOptions<EvaluationContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Manufacturer> Manufacturers { get; set; } = null!;
        public virtual DbSet<ManufacturerProductMapping> ManufacturerProductMappings { get; set; } = null!;
        public virtual DbSet<Product> Products { get; set; } = null!;
        public virtual DbSet<PurchaseHistory> PurchaseHistories { get; set; } = null!;
        public virtual DbSet<Rate> Rates { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name = ConnectionStrings:DefaultConnection");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Manufacturer>(entity =>
            {
                entity.HasIndex(e => e.Name, "IX_Manufacturers")
                    .IsUnique();

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<ManufacturerProductMapping>(entity =>
            {
                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.ManufacturerId).HasColumnName("ManufacturerID");

                entity.Property(e => e.ProductId).HasColumnName("ProductID");

                entity.HasOne(d => d.Manufacturer)
                    .WithMany(p => p.ManufacturerProductMappings)
                    .HasForeignKey(d => d.ManufacturerId)
                    .HasConstraintName("FK_dbo.ManufacturerProductMappings_dbo.Manufacturers_ManufacturerId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ManufacturerProductMappings)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_dbo.ManufacturerProductMappings_dbo.Products_ProductId");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasIndex(e => e.Name, "IX_Products")
                    .IsUnique();

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<PurchaseHistory>(entity =>
            {
                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.HasOne(d => d.Manufacturer)
                    .WithMany(p => p.PurchaseHistories)
                    .HasForeignKey(d => d.ManufacturerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_dbo.PurchaseHistories_dbo.Manufacturers_ManufacturerId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.PurchaseHistories)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_dbo.PurchaseHistories_dbo.Products_ProductId");

                entity.HasOne(d => d.Rate)
                    .WithMany(p => p.PurchaseHistories)
                    .HasForeignKey(d => d.RateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_dbo.PurchaseHistories_dbo.Rates_RateId");
            });

            modelBuilder.Entity<Rate>(entity =>
            {
                entity.HasIndex(e => e.ProductId, "IX_ProductId");

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Rates)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_dbo.Rates_dbo.Products_ProductId");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.UserName).HasMaxLength(256);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
