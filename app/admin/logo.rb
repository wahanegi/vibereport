ActiveAdmin.register Logo do
  permit_params :image, :type

  index do
    column :type
    column 'Image' do |logo|
      image_tag logo.image_url, height: '50px', width: 'auto' if logo.image.present?
    end
    column :updated_at
    column :created_at
    actions
  end

  show do
    attributes_table do
      row 'Logo' do |logo|
        if logo.image.present?
          image_tag logo.image_url, height: '150px', width: 'auto'
        else
          content_tag(:span, 'No logo selected yet.')
        end
      end
    end
  end

  form do |f|
    f.inputs 'Logo/Favicon Settings' do
      f.input :type, as: :select, collection: %w[Logo Favicon]
      f.input :image, as: :file, input_html: { direct_upload: true }
    end
    f.actions
  end

  controller do
    def create
      return redirect_to new_admin_logo_path, alert: 'Nothing attached' if params.dig('logo', 'image').blank?

      super
    end

    def update
      return redirect_to admin_logos_path, alert: 'Nothing attached' if params.dig('logo', 'image').blank?

      super
    end
  end
end
