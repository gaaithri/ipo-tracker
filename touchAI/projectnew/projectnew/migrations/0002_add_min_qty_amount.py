# Generated migration to add minQty and minAmount fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projectnew', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ipo',
            name='min_qty',
            field=models.DecimalField(decimal_places=2, max_digits=12, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='ipo',
            name='min_amount',
            field=models.DecimalField(decimal_places=2, max_digits=12, null=True, blank=True),
        ),
    ]
